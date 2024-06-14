//通知ボックス用のinbox
import { defineStore } from "pinia";
import type { inbox } from "~/types/message";

export const useInbox = defineStore("inbox", {
  state: () =>
  ({
    _Inbox: {
      "mention": {},
      "event": {}
    }
  } as {
    _Inbox: inbox;
  }),

  getters: {
    //通知Inboxを渡す
    getInbox: (state) => {
      return state._Inbox;
    },

    //すべてのメンション数を渡す
    getMentionNumTotal: (state):number => {
      //通知数
      let mentionNumTotal = 0;
      //通知数を取り出す
      for (let channelId of Object.keys(state._Inbox.mention)) {
        mentionNumTotal += state._Inbox.mention[channelId].length;
      }

      return mentionNumTotal;
    },

    //指定チャンネルのメンション数を渡す
    getMentionNumOnChannel: (state) => (channelId:string):number => {
      return state._Inbox.mention[channelId].length;
    }
  },
  
  actions: {
    bindInbox(data:inbox) {
      this._Inbox = data;
    },
  }
});

