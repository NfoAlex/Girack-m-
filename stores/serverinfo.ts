//サーバー情報保存
import { defineStore } from "pinia";
import type { Serverinfo } from "~/types/serverInfo";

export const useServerinfo = defineStore("serverinfo", {
  state: () => {
    return {
      serverinfo: {
        servername: "Girack-m-",
        registration: {
          available: false,
          invite: {
            inviteOnly: false,
          },
        },
        config: {
          PROFILE: {
            PROFILE_ICON_MAXSIZE: "128",
            PROFILE_USERNAME_MAXLENGTH: "32",
          },
          CHANNEL: {
            CHANNEL_DEFAULT_REGISTERANNOUNCE: "0001",
            CHANNEL_DEFAULT_JOINONREGISTER: ["0001"],
            CHANNEL_CREATE_AVAILABLE: true,
            CHANNEL_DELETE_AVAILABLEFORMEMBER: true,
            CHANNEL_PRIVATIZE_AVAILABLEFORMEMBER: true,
          },
          MESSAGE: {
            MESSAGE_PIN_ROLE: "Admin",
            MESSAGE_TXT_MAXLENGTH: "500",
            MESSAGE_FILE_MAXSIZE: "5e7",
          },
        },
        serverVersion: "alpha_20230301",
      } as Serverinfo,
      count: 0 as number
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
    updateInfo(data:Serverinfo) {
      this.serverinfo = data;
    }
  },

  getters: {
    getServerinfo():Serverinfo {
      return this.serverinfo;
    }
  }
})