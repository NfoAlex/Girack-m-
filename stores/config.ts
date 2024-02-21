//サーバー情報保存
import { defineStore } from "pinia";
import type Config from "~/types/config";

export const useConfig = defineStore("config", {
  state: () =>
  ({
    _Config: {
      notification: {
        enabled: true,
        notifyAllMessages: false,
        notifyMention: true
      },
      theme: "dark",
      channel: {
        displayRole: true,
        displayAttatchmentSizeLimit: 1e7,
      },
      sidebar: {
        ReadAllButtonEnabled: true,
        ReadAllButtonByShiftKey: true
      }
    },
  } as {
    _Config: Config;
  }),

  getters: {
    getConfig: (state) => {
      return state._Config;
    },
  },
  
  actions: {
    updateConfig(data:Config) {
      this._Config = data;
    },
  }
});

