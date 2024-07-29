<script setup lang="ts">
import { useElementBounding, useWindowSize } from "@vueuse/core";
import getMyRolePower from "~/composables/getMyRolePower";
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";

import data from "emoji-mart-vue-fast/data/twitter.json";
import { EmojiIndex, Picker } from "emoji-mart-vue-fast/src"; //TS...
import "emoji-mart-vue-fast/css/emoji-mart.css";

import type message from "~/types/message";

const emits = defineEmits<(e: "enterEditing") => void>();

const pickerRef = ref(null);
const { y } = useElementBounding(pickerRef);
const { height } = useWindowSize();

//Socket通信のユーザー情報用
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

//絵文字ピッカー用データ
const emojiIndex = new EmojiIndex(data);

const propsMessage = defineProps<{
  message: message;
}>();

/**
 * data
 */
const displayEmojiPicker = ref<boolean>(false);

/**
 * リアクションする
 */
// biome-ignore lint/suspicious/noExplicitAny: vue-emoji-martはtypeがない
const reactIt = (emoji: any) => {
  //console.log("/channel/:id :: reactIt : emoji->", emoji);
  socket.emit("reactMessage", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    channelId: propsMessage.message.channelId,
    messageId: propsMessage.message.messageId,
    reactionName: emoji._sanitized.id,
  });
};

/**
 * メッセージを削除する
 */
const deleteIt = () => {
  socket.emit("deleteMessage", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    channelId: propsMessage.message.channelId,
    messageId: propsMessage.message.messageId,
  });
};
</script>

<template>
  <span ref="pickerRef">
    <Picker
      v-if="displayEmojiPicker"
      @select="reactIt"
      :data="emojiIndex"
      title="リアクション"
      style="
        position: absolute;
        right: 0;
        background-color: rgb(var(--v-theme-sidebarBackground));
        color: rgb(var(--v-theme-on-surface));
        border: 0;
        border-radius: 18px;
      "
      color="lightblue"
      :style="height/2 > y ? 'top:50px;' : 'bottom:50px;'"
    />

    <v-card
      class="pa-1 d-flex align-center"
      rounded="pill"
      height="fit-content"
    >
      <p class="ml-2 text-disabled">{{ new Date(propsMessage.message.time).toLocaleString() }}</p>

      <!-- リアクション用絵文字ウィンドウトグル -->
      <v-btn
        @click="displayEmojiPicker = !displayEmojiPicker;"
        size="small"
        :variant="displayEmojiPicker?'tonal':'text'"
        icon="mdi-emoticon-happy-outline"
        class="pa-2"
      />

      <!-- 編集ボタン -->
      <v-btn
        v-if="propsMessage.message.userId === getMyUserinfo.userId"
        @click="emits('enterEditing')"
        size="small"
        icon="mdi-pencil"
        variant="text"
        class="pa-2"
      />

      <span
        v-if="getMyRolePower().MessageDelete || getMyUserinfo.userId === propsMessage.message.userId"
        class="d-flex align-center"
      >
        <div class="virtualDivider mx-1" />
        <v-btn
          @dblclick="deleteIt"
          size="small"
          color="error"
          variant="text"
          icon="mdi-delete"
          class="pa-2"
        />
      </span>
    </v-card>
  </span>
</template>

<style scoped>
.virtualDivider {
  border-right:2px solid rgb(var(--v-theme-messageHovered));
  height:1.25rem;
  width:1px;
}
</style>
