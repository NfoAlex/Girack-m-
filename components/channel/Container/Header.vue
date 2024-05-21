<script setup lang="ts">
import Channelinfo from "./Header/Channelinfo.vue";
import type { channel } from "~/types/channel";

/**
 * data
 */
const displayChannelinfo = ref<boolean>(false);

const props = defineProps<{
  channelInfo: channel
}>();
</script>

<template>

  <div>
    <!-- チャンネルページ -->
    <Channelinfo v-model="displayChannelinfo" v-if="displayChannelinfo" :channel-id="props.channelInfo.channelId" />
    <!-- 表示される部分 -->
    <m-card @click="displayChannelinfo=true" class="d-flex align-center py-0">
      <p>{{ props.channelInfo.channelName }}</p>
      <div class="virtualDivider mx-2 my-3" />
      <p>{{ props.channelInfo.description }}</p>
    </m-card>
  </div>

</template>

<style scoped>
.virtualDivider {
  border-right:1.5px solid rgb(var(--v-theme-messageHovered));
  padding: 0 !important;
  height:1.95rem;
  width:1px;
}
</style>
