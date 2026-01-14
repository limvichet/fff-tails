import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    'nuxt-og-image'
  ],
  ogImage: {
    defaults: {
      renderer: "satori",
    },
  },
  components: [
    {
      path: '~/components/OgImage',
      extensions: ['.vue'],
      global: true // This is key for Islands
    }
  ],
  routeRules: {
    '/': { redirect: '/dashboard' },
  },
})