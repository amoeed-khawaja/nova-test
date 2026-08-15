import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    // Resolves to src/server.ts (path is relative to srcDirectory).
    tanstackStart({
      server: {
        entry: "server",
      },
    }),
    // Nitro uses the vercel preset automatically when VERCEL=1 (Vercel builds).
    nitro(),
    viteReact(),
  ],
});
