import { defineConfig } from "vite";
import { resolve } from "path";
import { existsSync } from "fs";

export default defineConfig({
  build: {
    rollupOptions: {
      input: [resolve("index.html"), resolve("index.react.html")],
    },
  },
  plugins: [
    {
      name: "serve-static-demos",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/demos/") && !req.url.endsWith(".html")) {
            const htmlPath = resolve("public", req.url.replace(/\/$/, "").slice(1), "index.html");
            if (existsSync(htmlPath)) {
              req.url = req.url.replace(/\/?$/, "/index.html");
            }
          }
          next();
        });
      },
    },
  ],
});
