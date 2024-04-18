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
        latestFetchedHistoryLength: 13
      }
      */
    },
    _HasNewMessage: {
      /*
      "0001":false
      }
      */
    }
  } as {
    _History: {
      [key: string]: message[]
    },
    _Availability: {
      [key: string]: {
        atTop: boolean, //履歴の一番最初にいるかどうか
        atEnd: boolean, //履歴の一番最新にいるかどうか
        latestFetchedHistoryLength: number, //最後に取得した履歴の長さ
      }
    },
    _HasNewMessage: {
      [key: string]: boolean
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
    },

    //対象チャンネル用の履歴の位置データを返す
    getHistoryAvailability:(state) => (channelId:string) => {
      //そのチャンネル用の履歴位置データが無ければ作成
      if (state._Availability[channelId] === undefined) {
        state._Availability[channelId] = {
          atTop: false,
          atEnd: false,
          latestFetchedHistoryLength: 0
        };
      }
      //返す
      return state._Availability[channelId]
    },

    //そのチャンネルの新着があるかどうかを取得(データ操作もここでやる)
    getHasNewMessage:(state) => (channelId:string) => {
      //そもそもデータがないなら新たに作成
      if (state._HasNewMessage[channelId] === undefined) {
        state._HasNewMessage[channelId] = false;
        return false;
      }
      //そのまま返す
      return state._HasNewMessage[channelId];
    }
  },

  actions: {
    //メッセージを履歴へ追加
    addMessage(message:message) {
      //もし特定のチャンネル用の履歴JSONが空なら作る
      if (this._History[message.channelId] === undefined) {
        this._History[message.channelId] = [];
      }

      //履歴の最新にいるときのみ更新する
      if (this._Availability[message.channelId].atEnd) {
        //メッセージ追加
        this._History[message.channelId].unshift(message);
        //履歴が61以上あるなら古い方を1つ削除してトップにいないと設定
        if (this._History[message.channelId].length > 61) {
          this._History[message.channelId].splice(60);
          this._Availability[message.channelId].atTop = false;
        }
      }
    },

    //メッセージを更新
    updateMessage(message:message) {
      //履歴分ループ
      for (let index in this._History[message.channelId]) {
        //IDが一致するメッセージを探して更新する
        if (this._History[message.channelId][index].messageId === message.messageId) {
          this._History[message.channelId][index] = message
          break;
        }
      }
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
    },

    //履歴を挿入
    insertHistory(channelId:string, historyInserting:message[]) {
      //もし特定のチャンネル用の履歴JSONが空なら作ってそれを格納して終わる
      if (this._History[channelId] === undefined) {
        //空のを作る
        this._History[channelId] = [];
        //メッセージを１個ずつ追加する
        for (let msg of historyInserting) {
          this._History[channelId].push(msg);
        }

        return;
      }

      //挿入データ長が0ならここで停止
      if (historyInserting.length === 0) {
        return;
      }

      // console.log("history :: insertHistory : 時間の比較 履歴データ最新->", parseInt(this._History[channelId][0].time),
      //   " 挿入データの最後->", parseInt(historyInserting[1].time)
      // );

      //履歴の最新のメッセージ時間と取得した履歴の最後のメッセージ時間を比較して追加する場所を決める
      if (
        this._History[channelId][ this._History[channelId].length-1 ].time
          <=
        historyInserting[0].time
      ) { //取得データが履歴Storeより新しい
        //取得した履歴データが最新になるように配列をセット
        this._History[channelId] = [...historyInserting, ...this._History[channelId]];

        //console.log("history :: insertHistory : 新しいのを挿入した履歴の長さ->", this._History[channelId].length);

        //履歴データが60以上あるなら古い方を削る
        if (this._History[channelId].length > 61) {
          this._History[channelId].splice(30);
          //削っているので最後にいるかどうかは必ずfalseになるはず
          this._Availability[channelId].atTop = false;
        }
      } else { //取得データが履歴Storeより古い
        //取得した履歴データが最後になるように配列をセット
        this._History[channelId] = [...this._History[channelId], ...historyInserting];

        //console.log("history :: insertHistory : 古いのを挿入した履歴の長さ->", this._History[channelId].length);

        //履歴データが60以上あるなら新しい方を削る
        if (this._History[channelId].length > 61) {
          this._History[channelId].splice(0,30);
          //削っているので先頭にいるかどうかは必ずfalseになるはず
          this._Availability[channelId].atEnd = false;
        }
      }
    },

    //履歴の位置データを格納
    setAvailability(
      channelId:string,
      atData: {
        atTop: boolean,
        atEnd: boolean,
        latestFetchedHistoryLength: number
      }
    )  {
      //そのチャンネル用の履歴位置データが無ければ作成
      if (this._Availability[channelId] === undefined) {
        this._Availability[channelId] = {
          atTop: false,
          atEnd: false,
          latestFetchedHistoryLength: 0
        };
      }

      //格納
      this._Availability[channelId] = atData;
    },

    //新着があるかを設定
    setHasNewMessage(channelId:string, hasNewMessage:boolean) {
      this._HasNewMessage[channelId] = hasNewMessage;
    }
  }
});
