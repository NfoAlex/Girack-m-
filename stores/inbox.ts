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
    getInbox: (state) => {
      return state._Inbox;
    },
  },
  
  actions: {
    bindInbox(data:inbox) {
      this._Inbox = data;
    },
  }
});

