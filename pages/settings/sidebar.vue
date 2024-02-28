<script setup lang="ts">
import { useConfig } from '~/stores/config';

const { getConfig } = storeToRefs(useConfig());
</script>

<template>
  <div>
    <NuxtLayout name="settings">
      <p class="text-h6 mb-6">サイドバー</p>
      <m-card>
        <v-switch
          v-model="getConfig.sidebar.ReadAllButtonEnabled"
          label="すべて既読に設定するボタンを有効化"
        />
        <v-switch
          v-model="getConfig.sidebar.ReadAllButtonByShiftKey"
          :disabled="!getConfig.sidebar.ReadAllButtonEnabled"
          label="Shiftキーで全既読ボタンを表示する"
          class="ml-auto"
          style="width:calc(100% - 24px);"
        />
      </m-card>
    </NuxtLayout>
  </div>
</template>
