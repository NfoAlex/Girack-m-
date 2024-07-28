//サーバー情報保存
import { defineStore } from "pinia";
import type Config from "~/types/config";

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
		updateConfig(data: Config) {
			this._Config = data;
		},
		updateConfigSyncStatus(syncSwitch: boolean) {
			this._SyncConfig = syncSwitch;
		},
	},
});
