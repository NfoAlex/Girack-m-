//チャンネル情報
import { defineStore } from "pinia";
import type { channel } from "~/types/channel";

export const useChannelinfo = defineStore("channelinfo", {
  state: () =>
  ({
    _Channelinfo: {
      /*
      "0001": {
        ...
      }
      */
    }
  } as {
    _Channelinfo: {
      [key: string]: channel
    }
  }),

  getters: {
    //すべてのチャンネルを返す
    getChannelinfoAll: (state) => {
      return state._Channelinfo;
    },

    //チャンネル単体を返す
    getChannelinfoSingle: (state) => (channelId:number) => {
      return state._Channelinfo[channelId];
    }
  },
  
  actions: {
    //チャンネル情報を更新
    updateMyUserinfo(channelId:string, data: channel) {
      this._Channelinfo[channelId] = data;
    }
  }
});

