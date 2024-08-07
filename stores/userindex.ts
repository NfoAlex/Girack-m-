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
        SYSTEM: {
          userName: "SYSTEM",
          role: ["HOST"],
          userId: "SYSTEM",
          banned: false,
          channelJoined: [],
        },
      },
      _OnlineUsers: [],
    }) as {
      _UserIndex: {
        [key: string]: MyUserinfo;
      };
      _OnlineUsers: string[];
    },

  getters: {
    //指定したユーザー情報を返す
    getUserinfo:
      (state) =>
      (userId: string): MyUserinfo => {
        //空じゃなければそのデータを返す、空ならホルダー作成して情報取得
        if (state._UserIndex[userId] !== undefined) {
          return state._UserIndex[userId];
        }

        //ホルダーとしてデータ追加
        state._UserIndex[userId] = {
          userName: "User",
          role: ["Member"],
          userId: userId,
          banned: false,
          channelJoined: ["0001"],
        };

        //ユーザー情報を取得する
        //RequestSender用
        const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
        //WS通信
        socket.emit("fetchUserInfo", {
          RequestSender: {
            userId: getMyUserinfo.value.userId,
            sessionId: getSessionId.value,
          },
          userId: userId,
        });

        //ホルダー用データを返しておく
        return state._UserIndex[userId];
      },

    //オンラインユーザーリストを返す
    getOnlineUsers: (state) => {
      return state._OnlineUsers;
    },
  },

  actions: {
    setUserIndex(Userinfo: MyUserinfo) {
      if (Userinfo === null) return;
      this._UserIndex[Userinfo.userId] = Userinfo;
    },

    //オンラインユーザーリストを格納
    bindOnlineUsers(onlineUsers: string[]) {
      this._OnlineUsers = onlineUsers;
    },

    //オンラインユーザーリストへ一人追加
    addOnlineUser(userId: string) {
      //存在しないことを確認してから格納
      if (this._OnlineUsers.indexOf(userId) === -1) {
        this._OnlineUsers.push(userId);
      }
    },

    //オンラインユーザーリストから一人削除
    removeOnlineUserSingle(userId: string) {
      //削除するユーザーIdの場所
      const index = this._OnlineUsers.indexOf(userId);
      //存在するならそのユーザーIdを削除
      if (index !== -1) this._OnlineUsers.splice(index, 1);
    },

    //オンラインユーザーStoreの中身を丸ごと削除
    removeOnlineUsers() {
      this._OnlineUsers = [];
    },
  },
});
