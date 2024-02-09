<script setup>
import { loadSocket } from "../socketHandlers/socketInit";
import { socket } from './socketHandlers/socketInit';
//サービスの準備ができてからSocketの設定開始
onNuxtReady(() => { loadSocket(); })
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
}

</style>