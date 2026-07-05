import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { resolveMeta, injectMeta } from "./seo";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      const meta = await resolveMeta(url);
      const pageWithMeta = injectMeta(page, meta);
      res.status(200).set({ "Content-Type": "text/html" }).end(pageWithMeta);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve hashed build assets with a long cache, but never cache index.html —
  // otherwise the browser keeps loading a stale index.html (and old JS) until
  // a hard refresh. index.html must always revalidate so new builds show up.
  app.use(
    express.static(distPath, {
      // Don't let express.static auto-serve index.html for "/" — that would
      // bypass the SSR meta/JSON-LD injection in the app.use("*") handler
      // below. The root path must fall through so it gets per-route meta too.
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        } else {
          // hashed asset filenames are safe to cache long-term
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    })
  );

  // SPA fallback — always serve a fresh index.html (no caching) with per-route
  // meta tags injected so Googlebot, link previews, etc. see the right title /
  // description / canonical / OG image for the URL it actually requested.
  const indexPath = path.resolve(distPath, "index.html");
  app.use("*", async (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    try {
      const html = await fs.promises.readFile(indexPath, "utf-8");
      const meta = await resolveMeta(req.originalUrl);
      res.status(200).end(injectMeta(html, meta));
    } catch (err) {
      console.error("[spa-fallback] failed to render index.html", err);
      res.sendFile(indexPath);
    }
  });
}
