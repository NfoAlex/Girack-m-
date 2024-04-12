//このアプリの状態保存
import { defineStore } from "pinia";
import type AppStatus from "~/types/AppStatus";

export const useAppStatus = defineStore("appstatus", {
  state: () =>
  ({
    _AppStatus: {
      connected: false,
      fetchingHistory: false,
      profile: {
        authDone: false,
        UserinfoLoaded: false
      }
    }
  } as {
    _AppStatus: AppStatus;
  }),

  getters: {
    getAppStatus: (state) => {
      return state._AppStatus;
    },
  },
  
  actions: {
    updateAppStatus(data: AppStatus) {
      this._AppStatus = data;
    },
  }
});

