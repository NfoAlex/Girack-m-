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
    _MessageReadIdBefore: {
      /*
      "0001": "89123789781234123"
      */
    }
  } as {
    _MessageReadId: {
      [key: string]: string
    },
    _MessageReadIdBefore: {
      [key: string]: string
    }
  }),

  getters: {
    getMessageReadId: (state) => (channelId:string) => {
      return state._MessageReadId[channelId];
    },
  },
  
  actions: {
    //まるごと格納
    setMessageReadId(data:any) {
      //console.log("messageReadTime :: setmessageReadTime : 今->", this._MessageReadId);
      this._MessageReadId = data;
    },

    //チャンネルを指定して設定
    updateMessageReadId(channelId:string, messageId:string) {
      //console.log("messageReadTime :: setmessageReadTime : 今->", this._MessageReadId);
      this._MessageReadId[channelId] = messageId;
    },
  }
});

