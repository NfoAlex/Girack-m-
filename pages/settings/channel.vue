<script setup lang="ts">
import { useConfig } from "~/stores/config";

const { getConfig } = storeToRefs(useConfig());
</script>

<template>
  <div>
    <NuxtLayout name="settings">
      <p class="text-h6 mb-6">チャンネル</p>
      <m-card>
        <v-switch
          v-model="getConfig.channel.displayRole"
          label="メッセージ送信者名の横にロールを表示する"
        />

        <p class="text-medium-emphasis">プレビューとして表示する最高画像容量(Byte単位)</p>
        <v-text-field
          v-model="getConfig.channel.displayAttatchmentSizeLimit"
          rouned="xl"
        />
      </m-card>
    </NuxtLayout>
  </div>
</template>
