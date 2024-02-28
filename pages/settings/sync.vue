<script setup lang="ts">
import { useServerinfo } from '~/stores/serverinfo';
import { useConfig } from '~/stores/config';

const { getConfigSyncStatus } = storeToRefs(useConfig());
const Serverinfo = useServerinfo();

/**
 * data
 */
const syncSwitch = ref<boolean>(true);

//同期スイッチを監視
watch(syncSwitch, () => {
  //同期スイッチの値を設定Storeの同期設定へ適用
  useConfig().updateConfigSyncStatus(syncSwitch.value);
  //同期スイッチの値をlocalStorageへ書き込み
  setConfigLocalSync(syncSwitch.value);
});

onMounted(() => {
  //同期設定をスイッチとして表示するため変数へ
  syncSwitch.value = getConfigSyncStatus.value;
})
</script>

<template>
  <div>
    <NuxtLayout name="settings">
      <p class="text-h6 mb-6">同期設定</p>
      <p>カウンタ : {{ Serverinfo.count }}</p>
      <m-btn @click="Serverinfo.increment">加算</m-btn>

      <m-card>
        設定を同期する
        <v-switch v-model="syncSwitch" />
      </m-card>
    </NuxtLayout>
  </div>
</template>
