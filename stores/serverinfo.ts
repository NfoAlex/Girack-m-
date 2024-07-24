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
          TxtMaxLength: 300
        },
        STORAGE: {
          StorageSizeLimit: 128
        }
      }
    },
  } as {
    _Serverinfo: Serverinfo,
  }),
  
  getters: {
    getServerinfo():Serverinfo {
      return this._Serverinfo;
    }
  },

  actions: {
    updateInfo(data:Serverinfo) {
      this._Serverinfo = data;
    }
  },
})
