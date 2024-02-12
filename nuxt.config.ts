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
    // server: {
    //   host: "0.0.0.0",
    //   proxy: {
    //     "/socket.io/": {
    //       target: "ws://localhost:33333",
    //       ws: true,
    //       secure: false,
    //       changeOrigin: true
    //     },
    //     "/img": {
    //       target: "http://localhost:33333/",
    //       changeOrigin: true,
    //     }
    //   }
    // }
  },
  // nitro: {
  //   devProxy: {
  //     '/socket.io': { target: 'ws://localhost:33333', ws: true },
  //     "/img/**": { target: 'http://localhost:33333/img/**' },
  //   },
  //   routeRules: {
  //     '/socket.io': { proxy: 'ws://localhost:33333' },
  //     "/img/**": { proxy: 'http://localhost:33333/img/**' },
  //   }
  // },
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
        MBtn: "VBtn"
      },
      /* vuetify options */
      defaults: {
        global: {
          rounded: "xl",
          elevation: '0'
        },
        VTextField: {
          rounded: 'pill',
        },
        MBtn: {
          rounded: "pill",
        },
        MCard: {
          style: 'border-radius:20px;',
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