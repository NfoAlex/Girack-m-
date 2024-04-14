<script setup lang="ts">
import { useElementBounding, useWindowSize  } from '@vueuse/core';
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src';
import data from "emoji-mart-vue-fast/data/twitter.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";

const pickerRef = ref(null);
const { y } = useElementBounding(pickerRef);
const { height } = useWindowSize();

//絵文字ピッカー用データ
let emojiIndex = new EmojiIndex(data);

/**
 * data
 */
const displayEmojiPicker = ref<boolean>(false);

</script>

<template>
  <span ref="pickerRef">
    <Picker
      v-if="displayEmojiPicker"
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
      {{ height/2 > y }}
      {{ y }}
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
