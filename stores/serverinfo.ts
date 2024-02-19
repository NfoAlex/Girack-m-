//サーバー情報保存
import { defineStore } from "pinia";
import type { Serverinfo } from "~/types/serverInfo";

export const useServerinfo = defineStore("serverinfo", {
  state: () => 
  ({
    _Serverinfo: {
      servername: "Girack-m-",
      registration: {
        available: false,
        invite: {
          inviteOnly: false,
        },
      },
      config: {
        PROFILE: {
          iconMaxSize: 10000000,
          usernameMaxLength: 12,
        },
        CHANNEL: {
          channelIdAnnounceRegistration: "0001",
          defaultJoinOnRegister: ["0001"],
        },
        MESSAGE: {
          TxtMaxLength: 300,
          FileMaxSize: 5e7,
        },
      }
    },
    count: 0
  } as {
    _Serverinfo: Serverinfo,
    count: number
  }),
  
  getters: {
    getCount():number {
      return this.count;
    },

    getServerinfo():Serverinfo {
      return this._Serverinfo;
    }
  },

  actions: {
    increment() {
      this.count++
    },
    updateInfo(data:Serverinfo) {
      this._Serverinfo = data;
    }
  },
})
