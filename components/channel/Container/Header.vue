<script setup lang="ts">
import { useChannelinfo } from "~/stores/channel";
const route = useRoute();

//チャンネル情報取得
const { getChannelinfoSingle } = storeToRefs(useChannelinfo());
</script>

<template>
  <m-card>
    {{ getChannelinfoSingle($route.params.id)?.channelName }}
  </m-card>
</template>
