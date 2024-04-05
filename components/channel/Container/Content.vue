<script setup lang="ts">
import { useHistory } from '~/stores/history';
import { useUserIndex } from "~/stores/userindex";
import type { channel } from '~/types/channel';

const { getUserinfo } = useUserIndex();

//props(チャンネル情報)
const props = defineProps<{
  channelInfo: channel
}>();

const { getHistoryFromChannel } = storeToRefs(useHistory());
</script>

<template>
  <div style="overflow-y:auto;">
    <div style="height:100%; overflow-y:auto;" class="d-flex flex-column-reverse">
      <div
        v-for="
          (message, index)
            of
          getHistoryFromChannel(props.channelInfo.channelId)
        "
        :key="message.messageId"
        class="d-flex my-1 px-1"
      >
        <v-avatar class="mr-2">
          <v-img :src="'/icon/' + message.userId" :alt="message.userId" />
        </v-avatar>
        <m-card class="flex-grow-1 d-flex flex-column">
          <span>{{ getUserinfo(message.userId).userName }}</span>
          <span class="text-medium-emphasis">{{ message.content }}</span>
        </m-card>
    </div>
    </div>
  </div>
</template>
