//サーバー情報保存
import { defineStore } from "pinia";
import type Config from "~/types/config";

//上書きに使うよう設定データ
const configSample:Config = {
  notification: {
    notifyAllMessages: false,
    notifyMention: false
  },
  theme: "dark",
  channel: {
    displayRole: false,
    displayAttatchmentSizeLimit: 0
  },
  sidebar: {
    ReadAllButtonEnabled: false,
    ReadAllButtonByShiftKey: false
  }
};

export const useConfig = defineStore("config", {
  state: () =>
    ({
      _SyncConfig: true,
      _Config: {
        notification: {
          notifyAllMessages: false,
          notifyMention: true,
        },
        theme: "dark",
        channel: {
          displayRole: true,
          displayAttatchmentSizeLimit: 1e7,
        },
        sidebar: {
          ReadAllButtonEnabled: true,
          ReadAllButtonByShiftKey: true,
        },
      },
    }) as {
      _SyncConfig: boolean;
      _Config: Config;
    },

  getters: {
    getConfig: (state) => {
      return state._Config;
    },
    getConfigSyncStatus: (state): boolean => {
      return state._SyncConfig;
    },
  },

  actions: {
    //マージする形式で適用
    updateConfig(data: Config) {
      this._Config = {...configSample, ...data};
    },
    updateConfigSyncStatus(syncSwitch: boolean) {
      this._SyncConfig = syncSwitch;
    },
  },
});
