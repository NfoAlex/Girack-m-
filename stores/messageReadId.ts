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
      },
    }) as {
      _MessageReadId: {
        [key: string]: string;
      };
      _MessageReadIdBefore: {
        [key: string]: string;
      };
    },

  getters: {
    getMessageReadId: (state) => (channelId: string) => {
      return state._MessageReadId[channelId];
    },

    getMessageReadIdBefore: (state) => (channelId: string) => {
      return state._MessageReadIdBefore[channelId];
    },
  },

  actions: {
    //まるごと格納
    setMessageReadId(data: any) {
      //console.log("messageReadTime :: setmessageReadTime : 今->", this._MessageReadId);
      this._MessageReadId = data;

      //もし初回の格納ならBeforeにも設定
      if (JSON.stringify(this._MessageReadIdBefore) === "{}") {
        this._MessageReadIdBefore = structuredClone(data);
      }
    },

    //チャンネルを指定して設定
    updateMessageReadId(channelId: string, messageId: string) {
      //console.log("messageReadTime :: setmessageReadTime : 今->", messageId);

      //最新既読Idを更新
      this._MessageReadId[channelId] = messageId;
    },

    //ひとつ前用の最新既読Id設定
    updateMessageReadIdBefore(channelId: string) {
      //console.log("messageReadTime :: setmessageReadTimeBefore : ひとつ前用->", channelId);

      //もし最新既読Idが空なら飛ばす
      if (this._MessageReadId[channelId] === undefined) return;
      //ひとつ前の最新既読Idを更新
      this._MessageReadIdBefore[channelId] = this._MessageReadId[channelId];
    },

    //最新メッセージを削除
    deleteMessageReadId(channelId: string) {
      delete this._MessageReadId[channelId];
      delete this._MessageReadIdBefore[channelId];
    },
  },
});
