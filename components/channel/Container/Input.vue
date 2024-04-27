<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import type { channel } from '~/types/channel';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

//props(チャンネル情報)
const props = defineProps<{
  channelInfo: channel
}>();

/**
 * data
 */
const messageInput = ref<string>("");

/**
 * Enterキーの処理
 */
const triggerEnter = (event:Event) => {
  //メッセージが空なら停止
  if (messageInput.value === "" || messageInput.value === " ") return;

  //console.log("/channel/:id :: triggerEnter : Enterメッセージ->", messageInput.value, event, props);
  socket.emit("sendMessage", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    message: {
      channelId: props.channelInfo.channelId,
      content: messageInput.value
    }
  });
  
  //入力欄を初期化
  messageInput.value = "";
}
</script>

<template>
  <div>
    <v-text-field
      v-model="messageInput"
      @keydown.enter="triggerEnter"
      variant="solo-filled"
      rounded
    />
  </div>
</template>
