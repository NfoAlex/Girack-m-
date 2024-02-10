<script setup lang="ts">
import { useServerinfo } from '../../stores/serverinfo';
const Serverinfo = useServerinfo();
</script>

<template>
  <div>
    <NuxtLayout name="settings">
      <p>ここで同期</p>
      <p>カウンタ : {{ Serverinfo.count }}</p>
      <m-btn @click="Serverinfo.increment">加算</m-btn>
    </NuxtLayout>
  </div>
</template>