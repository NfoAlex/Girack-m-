<script setup lang="ts">
import { useConfig } from '~/stores/config';

const { getConfig } = storeToRefs(useConfig());
</script>

<template>
  <div>
    <NuxtLayout name="settings">
      <p class="text-h6 mb-6">チャンネル</p>
      <v-switch v-model="getConfig.channel.displayRole" label="メッセージ送信者名の横にロールを表示する" class="ml-auto" />
    </NuxtLayout>
  </div>
</template>
