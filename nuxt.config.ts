import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4},
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/image', "@nuxtjs/color-mode", 'nuxt-og-image'],
  colorMode: {
    storageKey: 'fff-color-theme',
    fallback: 'light',
    classSuffix: ''
  },
  // Set to '/' for Netlify
  app: {
    baseURL: '/',
  },
  $development: {
    runtimeConfig: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL,
      public: {
        siteUrl: "http://localhost:3000",
      },
    },
  },
  $production: {
    runtimeConfig: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL,
      public: {
        apiBaseUrl: "/api",
        siteUrl:
          process.env.NUXT_PUBLIC_SITE_URL ||
          "https://fff-tails.netlify.app",
      },
    },
  },
  nitro: {
    prerender: {
      failOnError: false, 
    }
  },
  ogImage: {
    enabled : true,
    defaults: {
      renderer: "satori",
    },
  },
  experimental: {
    viewTransition: true
  },
  ssr: true, 
  routeRules: {
    '/signin': { redirect: '/app/signin' },
    '/signup': { redirect: '/app/signup' },
    '/dashboard': { redirect: '/app/dashboard' },
  },
})