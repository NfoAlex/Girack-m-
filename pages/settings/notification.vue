<script setup lang="ts">
import { useConfig } from '~/stores/config';

const { getConfig } = storeToRefs(useConfig());
</script>

<template>
  <div>
    <NuxtLayout name="settings">
      <p class="text-h6 mb-6">通知</p>
      <m-card>
        <v-switch
          v-model="getConfig.notification.notifyAllMessages"
          label="受信するすべてのメッセージを通知する"
        />

        <v-switch
          v-model="getConfig.notification.notifyMention"
          label="受信した自分宛てのメンションメッセージを通知する"
        />

      </m-card>
    </NuxtLayout>
  </div>
</template>
