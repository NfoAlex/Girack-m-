<script setup>
import { loadSocket } from "../socketHandlers/socketInit";
import { useConfig } from "../stores/config";
import { socket } from './socketHandlers/socketInit';
//サービスの準備ができてからSocketの設定開始
onNuxtReady(() => { loadSocket(); })

//設定の値監視してテーマを切り替え
const { getConfig } = storeToRefs(useConfig());
//テーマ切り替え用
const theme = useTheme();
//監視開始
watch(getConfig, async () => {
  theme.global.name.value = getConfig.value.theme; //テーマを設定で設定されているものへ設定
});
</script>

<template>
  <div>
    <NuxtLayout>
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
  overflow-y: auto;
}

</style>
