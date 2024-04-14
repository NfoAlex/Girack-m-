<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useElementBounding, useWindowSize  } from '@vueuse/core';
import { useMyUserinfo } from '~/stores/userinfo';

import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src'; //TS...
import data from "emoji-mart-vue-fast/data/twitter.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";

import type message from '~/types/message';

const pickerRef = ref(null);
const { y } = useElementBounding(pickerRef);
const { height } = useWindowSize();

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

//絵文字ピッカー用データ
let emojiIndex = new EmojiIndex(data);

const propsMessage = defineProps<{
  message: message,
}>();

/**
 * data
 */
const displayEmojiPicker = ref<boolean>(false);

/**
 * リアクションする
 */
const reactIt = (emoji:any) => {
  console.log("/channel/:id :: reactIt : emoji->", emoji);
  socket.emit("reactMessage", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: propsMessage.message.channelId,
    messageId: propsMessage.message.messageId,
    reactionName: emoji._sanitized.id
  });
}

</script>

<template>
  <span ref="pickerRef">
    <Picker
      v-if="displayEmojiPicker"
      @select="reactIt"
      :data="emojiIndex"
      title="リアクション"
      style="position:absolute; right:0;"
      :style="height/2 > y ? 'top:50px;' : 'bottom:50px;'"
      defaultSkin="3"
    />

    <v-card
      class="pa-1"
      rounded="pill"
      height="fit-content"
    >
      <v-btn
        @click="displayEmojiPicker = !displayEmojiPicker;"
        size="small"
        :variant="displayEmojiPicker?'tonal':'text'"
        icon="mdi-emoticon-happy-outline"
        class="pa-2"
      />
      <v-btn
        @click=""
        size="small"
        variant="text"
        icon="mdi-pencil"
        class="pa-2"
      />
    </v-card>
  </span>
</template>