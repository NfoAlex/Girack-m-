<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

const emits = defineEmits<{(e: 'leaveEditing'): void}>();

const propsMessage = defineProps<{
  content: string,
  channelId: string,
  messageId: string
}>();

/**
 * data
 */
const contentUpdating = ref<string>(propsMessage.content);

/**
 * メッセージの編集を適用
 */
const updateMessage = () => {
  socket.emit("editMessage", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: propsMessage.channelId,
    messageId: propsMessage.messageId,
    contentUpdating: contentUpdating.value
  });
  //編集から抜け出す(親にて)
  emits("leaveEditing");
}

</script>

<template>
  <div>
    <p>ここで編集する {{ propsMessage.channelId.toString() }}</p>
    <v-textarea autogrow v-model="contentUpdating"></v-textarea>
    <m-card-compact
      class="ml-auto d-flex flex-row justify-end py-1"
      color="sidebarBackground"
      width="fit-content"
      style="position:sticky; bottom:0px; right:0;"
    >
      <m-btn
        @click="updateMessage"
        variant="text"
        icon="mdi-check"
        size="small"
      />
      <m-btn
        @click="emits('leaveEditing')"
        variant="text"
        icon="mdi-close"
        size="small"
      />
    </m-card-compact>
  </div>
</template>