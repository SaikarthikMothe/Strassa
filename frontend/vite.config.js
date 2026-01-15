import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Ensures file changes are detected
    },
    hmr: {
      overlay: true, // Enables error overlay
    },
    host: true, // Ensures it works on different networks
    port: 5173, // Try using a specific port
  },
});
