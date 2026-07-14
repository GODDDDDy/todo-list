import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages 项目站点部署在 /todo-list/ 子路径下，需要设置 base
  // 本地开发和其他平台（Vercel/Netlify 等）使用根路径
  base: process.env.GITHUB_ACTIONS ? "/todo-list/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
  },
  build: {
    target: "es2022",
    sourcemap: true,
  },
});
