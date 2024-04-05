//他人のユーザー情報保存用
import { defineStore } from "pinia";
import type { MyUserinfo } from "~/types/user";

import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "./userinfo";

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
    getUserinfo: (state) => (userId:string):MyUserinfo => {
      //空じゃなければそのデータを返す、空ならホルダー作成して情報取得
      if (state._UserIndex[userId] !== undefined) {
        return state._UserIndex[userId];
      } else {
        //ホルダーとしてデータ追加
        state._UserIndex[userId] = {
          userName: "User",
          role: ["Member"],
          userId: userId,
          banned: false,
          channelJoined: ["0001"]
        };

        //ユーザー情報を取得する
          //RequestSender用
        const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
          //WS通信
        socket.emit("fetchUser", {
          RequestSender: {
            userId: getMyUserinfo.value.userId,
            sessionId: getSessionId.value
          },
          userId: userId
        });

        //ホルダー用データを返しておく
        return state._UserIndex[userId];
      }
    },
  },
  
  actions: {
    setUserIndex(Userinfo: MyUserinfo) {
      this._UserIndex[Userinfo.userId] = Userinfo;
    }
  }
});

