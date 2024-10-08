//チャンネル情報
import { defineStore } from "pinia";
import type { channel, channelOrder } from "~/types/channel";

import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "./userinfo";

export const useChannelinfo = defineStore("channelinfo", {
  state: () =>
    ({
      _Channelinfo: {
        /*
      "0001": {
        ...
      }
      */
      },
      _ChannelOrder: [
        /*
      {channelId:"0001", ...}
      */
      ],
    }) as {
      _Channelinfo: {
        [key: string]: channel;
      };
      _ChannelOrder: channelOrder[];
    },

  getters: {
    //すべてのチャンネルを返す
    getChannelinfoAll: (state) => {
      return state._Channelinfo;
    },

    //チャンネル単体を返す
    getChannelinfoSingle: (state) => (channelId: string) => {
      //チャンネル情報がないならfetchしてホルダーを返す、あるならそれを返す
      if (state._Channelinfo[channelId] === undefined) {
        //ホルダー
        state._Channelinfo[channelId] = {
          channelId: channelId,
          channelName: channelId,
          createdBy: "xxxxx",
          description: "...",
          isPrivate: false,
          speakableRole: [],
        };

        //チャンネル情報を取得
        const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

        socket.emit("fetchChannelInfo", {
          RequestSender: {
            userId: getMyUserinfo.value.userId,
            sessionId: getSessionId.value,
          },
          channelId: channelId,
        });

        return state._Channelinfo[channelId];
      }

      return state._Channelinfo[channelId];
    },

    //チャンネル順序取得
    getChannelOrder: (state) => {
      return state._ChannelOrder;
    },
  },

  actions: {
    //チャンネル情報を更新(代入)
    updateChannelinfo(channelId: string, data: channel) {
      this._Channelinfo[channelId] = {
        ...this._Channelinfo[channelId],
        ...data,
      };
    },

    //チャンネル順序を更新(代入)
    updateChannelOrder(channelOrder: channelOrder[]) {
      this._ChannelOrder = channelOrder;
    },

    //チャンネル情報を削除
    deleteChannelinfo(channeId: string) {
      delete this._Channelinfo[channeId];
    },
  },
});
