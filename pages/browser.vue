<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import type { channel } from '~/types/channel';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const channelList = ref<channel[]>(); //チャンネル情報格納用

/**
 * チャンネルリストを受信
 * @param dat
 */
const SOCKETRfetchChannelList = (dat:{result:string, data:channel[]}) => {
  console.log("auth :: SOCKETRfetchChannelList : dat->", dat);
  channelList.value = dat.data;
}

onMounted(() => {
  socket.on("RESULT::fetchChannelList", SOCKETRfetchChannelList);

  socket.emit("fetchChannelList", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchChannelList", SOCKETRfetchChannelList);
})
</script>

<template>
  <div class="pa-5">
    ここがチャンネルブラウザ
    {{ channelList }}
  </div>
</template>
