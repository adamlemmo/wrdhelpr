import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/wrdhelpr/' : '/',
  build: {
    outDir: 'docs'
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'icons/pwa-192x192.png', 'icons/pwa-512x512.png'],
      manifest: {
        name: "wrdhelpr",
        short_name: "wrdhelpr",
        description: "A word puzzle helper",
        scope: '/wrdhelpr/',
        start_url: '/wrdhelpr/',
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: 'icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
}))