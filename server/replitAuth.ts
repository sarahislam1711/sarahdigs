import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

const isReplitEnv = !!process.env.REPL_ID;

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET || "local-dev-secret-change-in-production",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isReplitEnv,
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  if (!isReplitEnv) {
    // Local development: auto-login as admin
    const devUser = {
      claims: { sub: "local-dev-user" },
      access_token: "dev-token",
      expires_at: Math.floor(Date.now() / 1000) + 86400,
    };

    // Create dev user in database
    await storage.upsertUser({
      id: "local-dev-user",
      email: "dev@localhost",
      firstName: "Local",
      lastName: "Developer",
      role: "admin",
    });

    app.get("/api/login", (req, res) => {
      req.login(devUser, (err) => {
        if (err) return res.status(500).json({ error: "Login failed" });
        res.redirect("/admin");
      });
    });

    app.get("/api/callback", (req, res) => {
      res.redirect("/admin");
    });

    app.get("/api/logout", (req, res) => {
      req.logout(() => res.redirect("/"));
    });

    console.log("🔓 Local dev mode: Visit /api/login to auto-login as admin");
    return;
  }

  // Replit environment: use full OIDC auth
  const client = await import("openid-client");
  const { Strategy } = await import("openid-client/passport");
  const memoize = (await import("memoizee")).default;

  const getOidcConfig = memoize(
    async () => {
      return await client.discovery(
        new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
        process.env.REPL_ID!
      );
    },
    { maxAge: 3600 * 1000 }
  );

  const config = await getOidcConfig();

  const verify = async (
    tokens: any,
    verified: passport.AuthenticateCallback
  ) => {
    const user: any = {};
    user.claims = tokens.claims();
    user.access_token = tokens.access_token;
    user.refresh_token = tokens.refresh_token;
    user.expires_at = user.claims?.exp;
    
    await storage.upsertUser({
      id: user.claims["sub"],
      email: user.claims["email"],
      firstName: user.claims["first_name"],
      lastName: user.claims["last_name"],
      profileImageUrl: user.claims["profile_image_url"],
    });
    
    verified(null, user);
  };

  const registeredStrategies = new Set<string>();

  const ensureStrategy = (domain: string) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  app.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/admin",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // Local dev mode: check if logged in
  if (!isReplitEnv) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized - visit /api/login first" });
    }
    return next();
  }

  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const client = await import("openid-client");
    const memoize = (await import("memoizee")).default;
    const getOidcConfig = memoize(
      async () => client.discovery(
        new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
        process.env.REPL_ID!
      ),
      { maxAge: 3600 * 1000 }
    );
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    user.claims = tokenResponse.claims();
    user.access_token = tokenResponse.access_token;
    user.refresh_token = tokenResponse.refresh_token;
    user.expires_at = user.claims?.exp;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};