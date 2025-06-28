import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: '/wrdhelpr/',
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      devOptions: {
        enabled: true
      },
      manifest: {
        name: "wrdhelpr",
        short_name: "wrdhelpr",
        theme_color: "#317EFB",
        icons: [
          {
            src: "icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        "share_target": {
          "action": "/share-target.html",
          "method": "GET",
          "enctype": "application/x-www-form-urlencoded",
          "params": {
            "title": "title",
            "text": "text",
            "url": "url"
          }
        }
      },
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
