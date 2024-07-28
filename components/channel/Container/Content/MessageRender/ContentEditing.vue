<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

const emits = defineEmits<(e: "leaveEditing") => void>();

const propsMessage = defineProps<{
  content: string;
  channelId: string;
  messageId: string;
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
      sessionId: getSessionId.value,
    },
    channelId: propsMessage.channelId,
    messageId: propsMessage.messageId,
    contentUpdating: contentUpdating.value,
  });

  //編集から抜け出す(親にて)
  emits("leaveEditing");
};

/**
 * Enterキー処理
 */
const triggerEnter = (event: KeyboardEvent) => {
  //MacのIME入力中はEnterを無視
  // 229はMacのIME入力中のキーコードです非推奨ですが、現状これで対応しています
  if (
    navigator.userAgent.toUpperCase().indexOf("MAC") >= 0 &&
    event.keyCode === 229
  ) {
    return;
  }

  //Shiftキーが押されていたら停止
  if (event.shiftKey) return;
  //Enterキーによる改行を止める
  event.preventDefault();
  //メッセージ入力欄へフォーカスを戻す
  document.getElementById("elInput")?.focus();

  //編集内容が違ったらメッセージを更新する
  if (contentUpdating.value !== propsMessage.content) {
    updateMessage();
  } else {
    //内容が一緒ならシンプルに停止
    emits("leaveEditing");
  }
};
</script>

<template>
  <div>
    <v-textarea
      v-model="contentUpdating"
      @keydown.esc="emits('leaveEditing')"
      @keydown.enter="triggerEnter"
      variant="outlined"
      :rows="contentUpdating.split('\n').length"
      autogrow
      autofocus
    />
    <m-card-compact
      class="ml-auto mt-n3 d-flex flex-row justify-end py-1"
      color="sidebarBackground"
      width="fit-content"
      style="position:sticky; bottom:0; right:0;"
    >
      <m-btn
        @click="updateMessage"
        :disabled="contentUpdating === ''"
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