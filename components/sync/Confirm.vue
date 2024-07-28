<script setup lang="ts">
import { useConfig } from "~/stores/config";
//import { setConfigLocalSync } from "~/composables/setConfigLocalSync";
import { socket } from "../../socketHandlers/socketInit";
import { useMyUserinfo } from "../../stores/userinfo";

//Store取得用
const { getConfig } = storeToRefs(useConfig());
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
/**
 * emit
 */
const emit = defineEmits(["closeDialog", "cancel"]);

/**
 * サーバー上の設定を上書きする
 */
const configOverwrite = () => {
	//設定データを送信、更新させる
	socket.emit("saveUserConfig", {
		RequestSender: {
			userId: getMyUserinfo.value.userId,
			sessionId: getSessionId.value,
		},
		config: getConfig.value,
	});

	//同期スイッチの値を設定Storeの同期設定へ適用
	useConfig().updateConfigSyncStatus(true);
	//同期スイッチの値をlocalStorageへ書き込み
	setConfigLocalSync(true);

	//ダイアログを閉じる
	emit("closeDialog");
};

/**
 * 設定を取得してそれを適用する
 */
const configFetchAndApply = () => {
	//設定データを取得する
	socket.emit("fetchUserConfig", {
		userId: getMyUserinfo.value.userId,
		sessionId: getSessionId.value,
	});

	//同期スイッチの値を設定Storeの同期設定へ適用
	useConfig().updateConfigSyncStatus(true);
	//同期スイッチの値をlocalStorageへ書き込み
	setConfigLocalSync(true);

	//ダイアログを閉じる
	emit("closeDialog");
};
</script>

<template>

  <!-- ログアウト確認用ダイアログ -->
  <v-dialog
    style="max-width: 750px; width: 85vw"
  >
    <m-card>
      <v-card-title>
        確認
      </v-card-title>
      <v-card-text>
        同期設定をONに切り替えているようです。現在の設定をクラウド上へ上書きしますか?
      </v-card-text>
      <v-card-actions class="d-flex flex-column">
        <m-btn
          @click="configOverwrite"
          color="primary"
          block
          class="my-1"
        >はい、上書きしてください</m-btn>
        <m-btn
          @click="configFetchAndApply"
          color="secondary"
          block
          class="my-1"
        >いいえ、クラウド上のサーバーを取得し適用してください</m-btn>
        <m-btn
          @click="$emit('cancel')"
          class="my-1"
          variant="text"
          block
        >キャンセル</m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>

</template>
