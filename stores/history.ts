//履歴保存、管理
import { defineStore } from "pinia";

import type message from "~/types/message";

export const useHistory = defineStore("history", {
  state: () => 
  ({
    _History: {
      /*
      "0001": [
        {
          ...
        },
        {
          ...
        }
      ]
      */
    }
  } as {
    _History: {
      [key: string]: message[]
    }
  }),
  
  getters: {
    //対象チャンネルの履歴を全部返す
    getHistoryFromChannel:(state) => (channelId:string):message[] => {
      //もし特定のチャンネル用の履歴JSONが空なら作る
      if (state._History[channelId] === undefined) {
        state._History[channelId] = [];
      }
      return state._History[channelId];
    }
  },

  actions: {
    //メッセージを保存
    addMessage(message:message) {
      //もし特定のチャンネル用の履歴JSONが空なら作る
      if (this._History[message.channelId] === undefined) {
        this._History[message.channelId] = [];
      }
      //メッセージ格納
      this._History[message.channelId].unshift(message);
    }
  }
});
