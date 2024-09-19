import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
    },
    "process.env": process.env,
    VITE_DEV_SERVER_URL: process.env.VITE_DEV_SERVER_URL,
    VITE_DEV_S3_BUCKET: process.env.VITE_DEV_S3_BUCKET,
    VITE_REGION: process.env.VITE_REGION,
    ACCESS_KEY: process.env.ACCESS_KEY,
    S_ACCESS_KEY: process.env.S_ACCESS_KEY,
    VITE_BASE_IMAGE_LINK: process.env.VITE_BASE_IMAGE_LINK,
    VITE_CLIENT_GOOGLE_ID: process.env.VITE_CLIENT_GOOGLE_ID,
  },
});
