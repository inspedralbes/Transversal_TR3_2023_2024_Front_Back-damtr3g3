
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
  //modules: ["nuxt-icon", "nuxtjs/google-fonts"],
  //typescript: {shim: false},
  //build: { transpile: ["vuetify"] },
  //vite: { ssr: { noExternal: ["vuetify"]} },
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
  ], colorMode: {
    classSuffix: ''
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    config: {},
    injectPosition: 0,
    viewer: true,
  },
  
});