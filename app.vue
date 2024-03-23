<script setup>
import { socket } from "./socketHandlers/socketInit";
import { loadSocket } from "../socketHandlers/socketInit";
import { useConfig } from "../stores/config";
import { useAppStatus } from "../stores/AppStatus";

//サービスの準備ができてからSocketの設定開始
onNuxtReady(() => { loadSocket(); })

//設定の値監視してテーマを切り替え
const { getConfig } = storeToRefs(useConfig());
//状態監視用
const { getAppStatus } = storeToRefs(useAppStatus());

//テーマ切り替え用
const theme = useTheme();

/**
 * 設定を監視してテーマを適用
 */
watch(getConfig, async () => {
  theme.global.name.value = getConfig.value.theme; //テーマを設定で設定されているものへ設定
});

/**
 * WSサーバーへの接続の監視、そしてAppStatusの更新
 */
socket.on("connect", () => {
  getAppStatus.value.connected = true;
});
</script>

<template>
  <div class="d-flex flex-column" style="height:100vh; width:100vw;">
    <div>
      接続状況 :
      {{ getAppStatus.connected }}
    </div>
    <NuxtLayout class="flex-grow-1">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>

a {
  text-decoration: none;
  transition: 0.4s;
  color: rgb(var(--v-theme-on-surface));
}

a:visited {
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
}

html {
  background-color: rgb(var(--v-theme-sidebarBackground));
  overflow-y: hidden;
}

::-webkit-scrollbar {
  background: #000;
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-thumb {
  background-color: grey;
}

</style>
