//自分の情報保存
import { defineStore } from "pinia";
import type { MyUserinfo } from "~/types/user";

export const useMyUserinfo = defineStore("myuserinfo", {
  state: () =>
    ({
      _MyUserinfo: {
        userName: "User",
        role: ["Member"],
        userId: "XXXXXXXX",
        banned: false,
        channelJoined: ["0001"],
      },
      _sessionId: "",
    }) as {
      _MyUserinfo: MyUserinfo;
      _sessionId: string;
    },

  getters: {
    getMyUserinfo: (state) => {
      return state._MyUserinfo;
    },
    getSessionId: (state) => {
      return state._sessionId;
    },
  },

  actions: {
    updateMyUserinfo(data: MyUserinfo) {
      this._MyUserinfo = data;
    },
    updateSessionId(sessionId: string) {
      this._sessionId = sessionId;
    },
  },
});
