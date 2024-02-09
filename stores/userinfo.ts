//サーバー情報保存
import { defineStore } from "pinia";
import type { MyUserinfo } from "~/types/user";

export const useMyUserinfo = defineStore("myuserinfo", {
  state: () => {
    return {
      MyUserinfo: {} as MyUserinfo
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    updateInfo(data:MyUserinfo) {
      this.MyUserinfo = data;
    }
  }
})