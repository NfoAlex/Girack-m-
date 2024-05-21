<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';

import type { channel } from '~/types/channel';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

//prop
const props = defineProps<{
  channelId: string
}>();

/**
 * data
 */
const channelInfo = ref<channel>({ //チャンネルデータ
  channelId: '...',
  channelName: '...',
  createdBy: '',
  description: '',
  isPrivate: false,
  speakableRole: ''
});

/**
 * チャンネルデータ受け取り
 * @param dat 
 */
const SOCKETfetchChannelInfo = (
  dat: {
    result: string,
    data: {
      channelId: string,
      channelInfo: channel
    }
  }
) => {
  console.log("Channelinfo :: SOCKETfetchChannelInfo : dat->", dat);

  if (dat.result === "SUCCESS") {
    //チャンネルデータ格納
    channelInfo.value = dat.data.channelInfo;
  }
};

onMounted(() => {
  socket.on("RESULT::fetchChannelInfo", SOCKETfetchChannelInfo);

  //チャンネル情報を取得
  socket.emit("fetchChannelInfo", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: props.channelId
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchChannelInfo", SOCKETfetchChannelInfo);
});
</script>

<template>
  <v-dialog width="65vw" max-width="800px" height="65vh" max-height="700px">
    <m-card style="height:100%;">
      <span class="d-flex align-center">
        <v-icon>mdi-pound</v-icon>
        <p>{{ channelInfo.channelName }}</p>
      </span>
    </m-card>
  </v-dialog>
</template>
