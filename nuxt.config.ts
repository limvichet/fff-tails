import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },
  css: ['~/assets/css/main.css', '~/assets/css/fonts.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    '@nuxt/fonts', '@nuxt/icon', '@nuxt/image', "@nuxtjs/color-mode", 'nuxt-og-image',
    '@vite-pwa/nuxt'
  ],
  colorMode: {
    storageKey: 'color-theme',
    fallback: 'light',
    classSuffix: ''
  },
  app: {
    baseURL: '/',
  },
  $development: {
    runtimeConfig: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      public: { siteUrl: process.env.NUXT_PUBLIC_SITE_URL }
    },
  },
  $production: {
    runtimeConfig: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      public: { siteUrl: process.env.NUXT_PUBLIC_SITE_URL }
    },
  },
  nitro: {
    prerender: {
      failOnError: false,
    }
  },
  ogImage: {
    enabled: true,
    defaults: {
      renderer: "satori",
    },
  },
  experimental: {
    viewTransition: true
  },
  routeRules: {
    '/signin': { redirect: '/app/signin' },
    '/signup': { redirect: '/app/signup' },
    '/dashboard': { redirect: '/app/dashboard' },
  },
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    manifest: {
      name: 'Loan Schedule Generator',
      short_name: 'LoanSchedule',
      description: 'A simple loan schedule generator',
      theme_color: '#4F46E5',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  }

})