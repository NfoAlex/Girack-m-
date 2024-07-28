//メッセの既読時間Store
import { defineStore } from "pinia";

export const useMessageReadTime = defineStore("messagereadtime", {
  state: () =>
    ({
      _MessageReadTime: {
        /*
      "0001": "9734758937895324"
      */
      },
      _MessageReadTimeBefore: {
        /*
      "0001": "89123789781234123"
      */
      },
    }) as {
      _MessageReadTime: {
        [key: string]: string;
      };
      _MessageReadTimeBefore: {
        [key: string]: string;
      };
    },

  getters: {
    getMessageReadTime: (state) => (channelId: string) => {
      return state._MessageReadTime[channelId];
    },

    getMessageReadTimeBefore: (state) => (channelId: string) => {
      return state._MessageReadTimeBefore[channelId];
    },
  },

  actions: {
    //まるごと格納
    setMessageReadTime(data: any) {
      //console.log("messageReadTime :: setmessageReadTime : 今->", this._messageReadTime);
      this._MessageReadTime = data;

      //もし初回の格納ならBeforeにも設定
      if (JSON.stringify(this._MessageReadTimeBefore) === "{}") {
        this._MessageReadTimeBefore = structuredClone(data);
      }
    },

    //チャンネルを指定して設定
    updateMessageReadTime(channelId: string, messageId: string) {
      //console.log("messageReadTime :: setmessageReadTime : 今->", messageId);

      //最新既読時間を更新
      this._MessageReadTime[channelId] = messageId;
    },

    //ひとつ前用の最新既読Time設定
    updateMessageReadTimeBefore(channelId: string) {
      //console.log("messageReadTime :: setmessageReadTimeBefore : ひとつ前用->", channelId);

      //もし最新既読時間が空なら飛ばす
      if (this._MessageReadTime[channelId] === undefined) return;
      //ひとつ前の最新既読時間を更新
      this._MessageReadTimeBefore[channelId] = this._MessageReadTime[channelId];
    },

    //指定チャンネルの既読時間を削除
    deleteMessageReadTime(channelId: string) {
      delete this._MessageReadTime[channelId];
      delete this._MessageReadTimeBefore[channelId];
    },
  },
});
