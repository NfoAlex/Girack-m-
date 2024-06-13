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

    //メンション数を渡す
    getMentionNum: (state) => {
      return Object.keys(state._Inbox.mention).length;
    }
  },
  
  actions: {
    bindInbox(data:inbox) {
      this._Inbox = data;
    },
  }
});

