<script setup lang="ts">
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src';
import data from "emoji-mart-vue-fast/data/twitter.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";

//絵文字ピッカー用データ
let emojiIndex = new EmojiIndex(data);

/**
 * data
 */
const displayEmojiPicker = ref<boolean>(false);

</script>

<template>
  <span>
    <Picker
      v-if="displayEmojiPicker"
      :data="emojiIndex"
      title="リアクション"
      style="position:absolute; bottom:15px; right:100%;"
      :defaultSkin="1"
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
