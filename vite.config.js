import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  root: "src", // 👈 source files are under /src
  base: "/wrdhelpr/", // 👈 base URL for dev and production (GitHub Pages)
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "wrdhelpr",
        short_name: "wrdhelpr",
        theme_color: "#317EFB",
        icons: [
          {
            src: "/icons/pwa-192x192.png", // Adjust path to your icons folder in /public/icons/
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
  build: {
    outDir: "../dist", // 👈 output build to project root /dist folder
    emptyOutDir: true,
  },
});
