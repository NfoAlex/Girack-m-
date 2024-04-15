//自分の情報保存
import { defineStore } from "pinia";

export const useMessageReadId = defineStore("messagereadid", {
  state: () =>
  ({
    _MessageReadId: {
      /*
      "0001": "9734758937895324"
      */
    },
  } as {
    _MessageReadId: {
      [key: string]: string
    }
  }),

  getters: {
    getMessageReadId: (state) => (channelId:string) => {
      return state._MessageReadId[channelId];
    },
  },
  
  actions: {
    setMessageReadId(channelId:string, time:string) {
      this._MessageReadId[channelId] = time;
      console.log("messageReadTime :: setmessageReadTime : 今->", this._MessageReadId);
    },
  }
});

