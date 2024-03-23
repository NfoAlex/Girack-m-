//サーバー情報保存
import { defineStore } from "pinia";
import type { MyUserinfo } from "~/types/user";
import type { channel } from "~/types/channel";

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
    _ActiveChannelinfo: {
      /*
      "0001": {
        ...
      }
      */
    },
    _sessionId: ""
  } as {
    _MyUserinfo: MyUserinfo;
    _ActiveChannelinfo: {
      [key: string]: channel
    },
    _sessionId: string;
  }),

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
    }
  }
});

