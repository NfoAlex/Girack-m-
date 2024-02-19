//サーバー情報保存
import { defineStore } from "pinia";
import type { MyUserinfo } from "~/types/user";

export const useMyUserinfo = defineStore("myuserinfo", {
  state: () =>
  ({
    _MyUserinfo: {
      userName: "User",
      role: ["Member"],
      userId: "XXXXXXXX",
      sessionId: "",
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

