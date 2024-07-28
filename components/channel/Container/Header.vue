<script setup lang="ts">
import type { channel } from "~/types/channel";
import Channelinfo from "./Header/Channelinfo.vue";

/**
 * data
 */
const displayChannelinfo = ref<boolean>(false);

const props = defineProps<{
	channelInfo: channel;
}>();
</script>

<template>

  <div>
    <!-- チャンネルページ -->
    <Channelinfo v-model="displayChannelinfo" v-if="displayChannelinfo" :channel-id="props.channelInfo.channelId" />
    <!-- 表示される部分 -->
    <m-card
      width="100%"
      class="d-flex align-center py-0"
    >
      <p class="text-truncate flex-shrink-0" style="max-width:85%">
        <v-icon v-if="props.channelInfo.isPrivate">mdi:mdi-lock</v-icon>
        {{ props.channelInfo.channelName }}
      </p>
      <div class="virtualDivider mx-2 my-3" />
      <p class="text-truncate">{{ props.channelInfo.description }}</p>
      <m-btn
        @click="displayChannelinfo=true"
        icon="mdi-information"
        variant="text"
        size="small"
        class="ml-auto flex-shrink-0"
      />
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
