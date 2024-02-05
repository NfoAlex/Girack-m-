<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { socket } from "./socketHandlers/socketInit";

onMounted(() => {
  socket;
});
</script>

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
