import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  // Nuxt 4 ប្រើ 'future' flag ដើម្បីឱ្យស្គាល់រចនាសម្ព័ន្ធ folder ថ្មីបានល្អ
  future: {
    compatibilityVersion: 4,
  },
  
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // កែសម្រួល Path CSS ឱ្យប្រើ Alias (~~/ តំណាងឱ្យ root)
  css: ['~/assets/css/main.css'],

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

  // កំណត់ Site URL សម្រាប់ OG Image (ចាំបាច់ណាស់)
  site: {
    url: 'https://limvichet.github.io/fff-tails',
  },

  ogImage: {
    enabled : false,
    defaults: {
      renderer: "satori",
    },
  },

  app: {
    // ត្រូវប្រាកដថា process.env.NODE_ENV ដើរត្រឹមត្រូវ
    baseURL: process.env.NODE_ENV === 'production' ? '/fff-tails/' : '/',
    // buildAssetsDir: 'assets',
  },

  // បើប្រើ GitHub Pages គួរកំណត់ ssr: false (Static Site) 
  // បើ ssr: true អ្នកត្រូវប្រើប្រព័ន្ធបង្កប់ (Prerendering)
  ssr: true, 

  nitro: {
    preset: 'github-pages',
    // បើចង់ប្រើ SSR: true ត្រូវថែម prerender ឱ្យគ្រប់ route
    prerender: {
      routes: ['/', '/dashboard']
    }
  },
})