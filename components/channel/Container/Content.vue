<script setup lang="ts">
import { useHistory } from '~/stores/history';
import type { channel } from '~/types/channel';

//props(チャンネル情報)
const props = defineProps<{
  channelInfo: channel
}>();

const { getHistoryFromChannel } = storeToRefs(useHistory());
</script>

<template>
  <div style="overflow-y:auto;">
    <div class="d-flex flex-column-reverse">
      <m-card
        v-for="
          (message, key, index)
            of
          getHistoryFromChannel(props.channelInfo.channelId)
        "
        :key="key"
      >
        {{ message }}
      </m-card>
    </div>
  </div>
</template>
