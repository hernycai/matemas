import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function backendApiPlugin() {
  return {
    name: 'embedded-backend-api',
    async configureServer(server) {
      process.env.DATA_SOURCE = process.env.DATA_SOURCE || 'MOCK';
      process.env.EMBEDDED_API = 'true';
      try {
        const mod = await import('../Back-End/src/app.js');
        const app = mod.default;
        server.middlewares.use(app);
        console.log('✅ Back-End Express API embedded into Vite dev server (/api)');
      } catch (err) {
        console.warn('⚠️ Could not mount Back-End in Vite dev server:', err.message);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    backendApiPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', '192x192.png', '512x512.png'],
      manifest: {
        name: 'Mate+',
        short_name: 'Mate+',
        description: 'Aprendé matemáticas a tu ritmo con Mate+',
        lang: 'es',
        theme_color: '#8FD8FD',
        background_color: '#F0F1EB',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      },
      // Configuración crítica para Vercel
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
        suppressWarnings: true
      }
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: 'all',
  },
})