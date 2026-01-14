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
      pathPrefix: false, // Optional: prevents OgImageOgImageTemplate.vue
      global: true 
    },
    // Ensure standard components are still auto-imported
    '~/components'
  ],

  routeRules: {
    '/': { redirect: 'app/dashboard' },
  },

  // Ensure Tailwind v4 works with Nuxt's layer system
  features: {
    inlineStyles: false
  }
})