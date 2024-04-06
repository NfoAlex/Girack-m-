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
    },
    _Availability: {
      /*
      "0001": {
        atTop: false,
        atEnd: true
      }
      */
    }
  } as {
    _History: {
      [key: string]: message[]
    },
    _Availability: {
      [key: string]: {
        atTop: boolean,
        atEnd: boolean
      }
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
    },

    //履歴をまるごと上書きする
    setHistory(channelId:string, history:message[]) {
      //もし特定のチャンネル用の履歴JSONが空なら作る
      if (this._History[channelId] === undefined) {
        this._History[channelId] = [];
      }

      //メッセージを１個ずつ追加する
      for (let msg of history) {
        this._History[channelId].push(msg);
      }
    }
  }
});
