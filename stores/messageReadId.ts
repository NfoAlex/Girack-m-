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

    getMessageReadIdBefore: (state) => (channelId:string) => {
      return state._MessageReadIdBefore[channelId];
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
      //もし一つ古い最新既読IdがundefinedならそのメッセージIDに
      if (this._MessageReadIdBefore[channelId] === undefined) {
        this._MessageReadIdBefore[channelId] = messageId;
      } else {
        this._MessageReadIdBefore[channelId] = this._MessageReadId[channelId];
      }
      //最新既読Idを更新
      this._MessageReadId[channelId] = messageId;
    },
  }
});

