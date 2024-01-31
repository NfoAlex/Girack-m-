// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["@/assets/styles/main.scss"],
  modules: ["@pinia/nuxt", "vuetify-nuxt-module"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/variables.scss";',
        },
      },
    },
  },
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
      defaults: {
        global: {
          rounded: "xl"
        },
        VCard: {
          style: 'border-radius:20px;',
          class: 'pa-4',
          elevation: '0'
        }
      }
    }
  },
  devtools: { enabled: true },
});