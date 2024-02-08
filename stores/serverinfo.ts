//サーバー情報保存
import { defineStore } from "pinia";
import type { ServerInfo } from "~/types/serverInfo";

export const storeServerinfo = defineStore("serverinfo", {
  state: () => {
    return {
      serverinfo: {} as ServerInfo,
      count: 0 as number
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
  },
})