//他人のユーザー情報保存用
import { defineStore } from "pinia";
import type { MyUserinfo } from "~/types/user";

export const useUserIndex = defineStore("userindex", {
  state: () =>
  ({
    _UserIndex: {
      /*
      "xxx": {
        userName: "User",
        role: ["Member"],
        userId: "XXXXXXXX",
        banned: false,
        channelJoined: ["0001"]
      }
      */
    }
  } as {
    _UserIndex: {
      [key: string]: MyUserinfo
    };
  }),

  getters: {
    getUserinfo: (state) => (userId:string) => {
      return state._UserIndex[userId];
    },
  },
  
  actions: {
    setUserIndex(Userinfo: MyUserinfo) {
      this._UserIndex[Userinfo.userId] = Userinfo;
    }
  }
});

