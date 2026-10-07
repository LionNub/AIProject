import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  publicDir: path.resolve(__dirname, "../assets"),
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, "postcss.config.cjs"),
  },
  resolve: {
    alias: {
      "@config": path.resolve(__dirname, "../config.js"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:3001",
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../dist"),
    emptyOutDir: true,
  },
});
