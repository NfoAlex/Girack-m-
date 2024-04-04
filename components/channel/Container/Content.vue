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
  <div>
    {{
    props.channelInfo.channelId!==undefined ?
      getHistoryFromChannel(props.channelInfo.channelId) : "Loading..."
    }}
  </div>
</template>
