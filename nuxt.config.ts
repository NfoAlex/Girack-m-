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
          rounded: "xl",
          elevation: '0'
        },
        VTextField: {
          rounded: 'pill',
        },
        VCard: {
          style: 'border-radius:20px;',
          class: 'pa-4',
        },
        VBtn: {
          class: 'pa-4',
        }
      }
    }
  },
  devtools: { enabled: true },
});