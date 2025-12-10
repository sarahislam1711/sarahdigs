import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import crypto from "crypto";

// Simple password-based authentication for admin access
// Uses a single admin password stored in environment variable

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 7 days
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());

  // Login endpoint - validates admin password
  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    if (password === adminPassword) {
      (req.session as any).isAuthenticated = true;
      (req.session as any).userId = 'admin';
      (req.session as any).loginTime = Date.now();
      
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Login failed" });
        }
        res.json({ success: true, message: "Login successful" });
      });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });

  // GET /api/login for auto-login in development (redirects to admin)
  app.get("/api/login", (req, res) => {
    if ((req.session as any).isAuthenticated) {
      return res.redirect("/admin");
    }
    // Redirect to login page
    res.redirect("/admin/login");
  });

  // Logout endpoint
  app.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.redirect("/");
    });
  });

  // Check auth status
  app.get("/api/auth/status", (req, res) => {
    res.json({ 
      isAuthenticated: !!(req.session as any).isAuthenticated 
    });
  });
}

// Middleware to protect admin routes
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if ((req.session as any).isAuthenticated) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
