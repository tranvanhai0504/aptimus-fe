import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      global: {},
      alias: {
        "./runtimeConfig": "./runtimeConfig.browser",
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "https://34.204.90.7:8080",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
