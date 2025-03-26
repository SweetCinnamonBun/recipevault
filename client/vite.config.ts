import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../API/wwwroot"),
    chunkSizeWarningLimit: 1500, 
    emptyOutDir: true, 
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5028/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});