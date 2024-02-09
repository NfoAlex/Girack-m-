//サーバー情報保存
import { defineStore } from "pinia";
import type { Serverinfo } from "~/types/serverInfo";

export const useServerinfo = defineStore("serverinfo", {
  state: () => {
    return {
      serverinfo: {} as Serverinfo,
      count: 0 as number
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
    updateInfo(data:Serverinfo) {
      this.serverinfo = data;
    }
  },

  getters: {
    getServerinfo():Serverinfo {
      return this.serverinfo;
    }
  }
})