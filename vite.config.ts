import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy /api requests to Firebase Functions emulator during development
      "/api": {
        target: "http://127.0.0.1:5001/tforart-dev/asia-southeast1",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\//, "/"),
      },
    },
  },
});
