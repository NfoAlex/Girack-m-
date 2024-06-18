import vue from "@vitejs/plugin-vue";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ["@/assets/styles/main.scss"],
  modules: ["@pinia/nuxt", "vuetify-nuxt-module", "@vueuse/nuxt", "@nuxtjs/google-fonts"],
  app: {
    keepalive: {include: ["Channelbar", "EmojiRender"]},
  },
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
    server: {
      proxy: {
        "/uploadProfileIcon": "http://localhost:33333/",
        "/icon": "http://localhost:33333/"
      }
    }
  },
  nitro: {
    rollupConfig: {
      plugins: [vue()]
    }
  },
  routeRules: {
    '/uploadProfileIcon': { cors:true },
    '/server/**': { ssr:false }
  },
  //ここでプロキシ適用(なぜかエラー扱い)
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
        MCardCompact: "VCard",
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
          color: 'primary',
          inset: true,
          hideDetails: true
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
        VProgressCircular: {
          width: 7
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
          style: 'border-radius:28px; background-color:rgb(var(--v-theme-sidebarBackground));',
          class: 'pa-4',
        },
        MCardCompact: {
          style: 'border-radius:28px;'
        }
      },
      theme: {
        themes: {
          light: {
            colors: {
              "sidebarBackground": "#efefef",
              "cardInner": "#f9f9f9",
              "messageHovered": "#eaeaea"
            }
          },
          dark: {
            colors: {
              "sidebarBackground": "#020202",
              "cardInner": "#121212",
              "messageHovered": "#484848"
            }
          }
        }
      }
    }
  },
  googleFonts: {
    families: {
      "Noto Sans JP": [500, 700],
      Inter: true,
    },
    download: true,
    inject: true
  },
  devtools: { enabled: false },
});
