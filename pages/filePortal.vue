<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
</script>

<template>
  <div class="pt-5 px-5 d-flex flex-column" style="height:100%;">
    <span class="d-flex align-center">
      <p
        class="text-h5"
        style="font-weight:700;"
      >ファイルポータル</p>
    </span>
    <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />
  </div>
</template>