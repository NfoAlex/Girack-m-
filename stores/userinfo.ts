//サーバー情報保存
import { defineStore } from "pinia";
import type { MyUserinfo } from "~/types/user";

export const useMyUserinfo = defineStore("myuserinfo", {
  state: () =>
  ({
    _MyUserinfo: {
      username: "User",
      role: ["Member"],
      userid: "XXXXXXXX",
      sessionid: "",
      banned: false,
      channelJoined: ["0001"],
    },
  } as {
    _MyUserinfo: MyUserinfo;
  }),

  getters: {
    getMyUserinfo: (state) => {
      return state._MyUserinfo;
    },
  },
  
  actions: {
    updateMyUserinfo(data: MyUserinfo) {
      this._MyUserinfo = data;
    },
  }
});

