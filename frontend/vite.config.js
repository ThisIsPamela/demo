import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/pamela": {
        target: "https://api.thisispamela.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pamela/, ""),
      },
    },
  },
});
