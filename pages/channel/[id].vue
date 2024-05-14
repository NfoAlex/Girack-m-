<script setup lang="ts">
import { useAppStatus } from "~/stores/AppStatus";
//AppStatus取得用
const { getAppStatus } = storeToRefs(useAppStatus());
</script>

<template>
  <div class="px-4 pt-4 d-flex align-stretch" style="height:100%;">
    <ChannelChannelbar class="mr-2 flex-shrink-0" style="width:20vw; max-width:250px;" />
    <ChannelContainer v-if="getAppStatus.hasMessageReadId" class="px-2 py-2 flex-shrink-1 flex-grow-1" />
    <span v-else class="d-flex flex-column align-center mx-auto mt-5">
      <v-progress-circular indeterminate :width="5"></v-progress-circular>
      <div class="text-center mt-3">Loading...</div>
    </span>
  </div>
</template>
