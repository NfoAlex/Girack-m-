//履歴保存、管理
import { defineStore } from "pinia";

import type message from "~/types/message";

export const useHistory = defineStore("history", {
  state: () => 
  ({
    _History: {
      /*
      "0001": {
        "0001-222220240404160919": {
          ...
        },
        "0001-101020240404161132": {
          ...
        }
      }
      */
    }
  } as {
    _History: {
      [key: string]: { //チャンネルID
        [key: string]: message //メッセージID、メッセージ
      }
    }
  }),
  
  getters: {
    //対象チャンネルの履歴を全部返す
    getHistoryFromChannel:(state) => (channelId:string):{[key: string]: message} => {
      return state._History[channelId];
    }
  },

  actions: {
    //メッセージを保存
    addMessage(message:message) {
      //もし特定のチャンネル用の履歴JSONが空なら作る
      if (this._History[message.channelId] === undefined) {
        this._History[message.channelId] = {};
      }
      //メッセージ格納
      this._History[message.channelId][message.messageId] = message;
    }
  }
});
