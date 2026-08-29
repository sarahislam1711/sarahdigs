import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import { redirectsMiddleware } from "./redirects";
import { startNurtureScheduler } from "./nurture";

const app = express();
app.disable("x-powered-by");
app.use(compression());

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Fix hero content - update rotating words and CTA text
  try {
    const homeContent = await storage.getPageContent("home");
    const heroContent = homeContent.find(c => c.sectionKey === "hero");
    if (heroContent) {
      const content = heroContent.content as Record<string, unknown>;
      const words = content.rotatingWords as string[] | undefined;
      const expectedWords = ["goals", "users", "data", "intent", "gaps", "story"];
      const needsWordFix = !words || words.length !== expectedWords.length || !expectedWords.every(w => words.includes(w));
      const needsCtaFix = content.ctaText !== "Explore Services";
      if (needsWordFix || needsCtaFix) {
        await storage.upsertPageContent({
          pageSlug: "home",
          sectionKey: "hero",
          content: { ...content, rotatingWords: expectedWords, ctaText: "Explore Services" }
        });
        log("Updated hero content");
      }
    }
  } catch (e) {
    console.error("Failed to update hero content:", e);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Error:", err);
    
    // Don't expose internal errors in production
    const responseMessage = app.get("env") === "production" && status === 500 
      ? "Internal Server Error" 
      : message;

    res.status(status).json({ message: responseMessage });
    
    // Don't throw in error handler - this crashes the server
    // Just log it instead
  });

  // 301/302 redirects — runs before static/vite so it can intercept
  // retired URLs and bounce them to their new home.
  app.use(redirectsMiddleware);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const listenOpts: { port: number; host: string; reusePort?: boolean } = {
    port,
    host: "0.0.0.0",
  };
  // reusePort is Linux-only — Node on macOS rejects it with ENOTSUP.
  if (process.platform === "linux") {
    listenOpts.reusePort = true;
  }
  server.listen(listenOpts, () => {
    log(`serving on port ${port}`);
    // Start the daily nurture-sequence scheduler.
    startNurtureScheduler();
  });
})();