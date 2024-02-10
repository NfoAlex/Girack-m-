// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["@/assets/styles/main.scss"],
  modules: ["@pinia/nuxt", "vuetify-nuxt-module"],
  pinia: {
    storesDirs: ['./stores/**'],
  },
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
      /* マテリアルデザイン用 */
      aliases: {
        MCard: "VCard",
        MBtn: "VBtn"
      },
      /* vuetify options */
      defaults: {
        global: {
          elevation: '0'
        },
        VTextField: {
          rounded: 'pill',
        },
        MBtn: {
          rounded: "pill",
        },
        MCard: {
          style: 'border-radius:20px; background-color:rgb(var(--v-theme-sidebarBackground));',
          class: 'pa-4',
        },
      },
      theme: {
        themes: {
          light: {
            colors: {
              "sidebarBackground": "#efefef"
            }
          },
          dark: {
            colors: {
              "sidebarBackground": "#020202"
            }
          }
        }
      }
    }
  },
  devtools: { enabled: true },
});