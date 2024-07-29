<script setup lang="ts">
import { useConfig } from "~/stores/config";

const { getConfigSyncStatus } = storeToRefs(useConfig());

/**
 * data
 */
const syncSwitch = ref<boolean>(true);
const displayConfirmSync = ref<boolean>(false); //同期設定の切り替え確認ダイアログ

onMounted(() => {
  //同期設定をスイッチとして表示するため変数へ
  syncSwitch.value = getConfigSyncStatus.value;

  //同期設定を変数へ格納してから同期スイッチを監視
  watch(syncSwitch, () => {
    //オンにするのなら現在の設定をどうするか確認する
    if (syncSwitch.value === true) {
      //ダイアログ表示
      displayConfirmSync.value = true;
    } else {
      //同期スイッチの値を設定Storeの同期設定へ適用
      useConfig().updateConfigSyncStatus(false);
      //falseをlocalStorageへ書き込み
      setConfigLocalSync(false);
    }
  });
});
</script>

<template>
  <!-- 同期設定をオンにする際の上書き確認 -->
  <SyncConfirm
    v-model="displayConfirmSync"
    @closeDialog="()=>{ displayConfirmSync=false; }"
    @cancel="()=>{ displayConfirmSync=false; syncSwitch=false; }"
  />
  <div>
    <NuxtLayout name="settings">
      <p class="text-h6 mb-6">同期設定</p>
      <m-card>
        <v-switch v-model="syncSwitch" label="設定を同期する" density="compact" />
        <p class="text-disabled">ONにするとクラウド上の設定を上書きするか確認されます</p>
      </m-card>
    </NuxtLayout>
  </div>
</template>
