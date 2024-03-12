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
    }
  },
  //ここでプロキシ適用
  serverMiddleware: [
    { path: '/socket.io', handler: './server/middleware/proxy.ts' },
  ],
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* マテリアルデザイン用 */
      aliases: {
        MCard: "VCard",
        MBtn: "VBtn",
        MInput: "VInput"
      },
      /* vuetify options */
      defaults: {
        global: {
          elevation: '0'
        },
        VAlert: {
          rounded: 'xl'
        },
        VSwitch: {
          color: 'primary'
        },
        VDivider: {
          style: 'border-radius: 8px',
          thickness: '2'
        },
        VTextField: {
          rounded: 'lg'
        },
        VTextarea: {
          rounded: 'lg'
        },
        VCheckbox: {
          hideDetails: true
        },
        VColorPicker: {
          rounded: 'xl'
        },
        MInput: {
          rounded: 'pill'
        },
        MBtn: {
          rounded: "pill",
          size: "large",
          class: "mx-1"
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
