import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const PORT = Number(env.VITE_PORT);
  const API_BASE_URL = env.VITE_API_BASE_URL;

  // https://vite.dev/config/
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "prompt",
        injectRegister: false,

        pwaAssets: {
          disabled: false,
          config: true,
        },

        manifest: {
          name: "AI Setu ERP",
          short_name: "AISetu",
          description: "AI Setu ERP Panel",
          theme_color: "#0f172a",
        },

        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
        },

        devOptions: {
          enabled: true,
          navigateFallback: "index.html",
          suppressWarnings: true,
          type: "module",
        },
      }),
    ],
    server: {
      host: true,
      allowedHosts: true,
      port: PORT,
      proxy: {
        "/api": {
          target: API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    preview: {
      port: PORT,
      strictPort: true,
    },
    define: {
      "process.env.VITE_API_BASE_URL": JSON.stringify(API_BASE_URL),
    },
  };
});
