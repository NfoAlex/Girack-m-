<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { EmojiIndex } from 'emoji-mart-vue-fast/src'; //TS...
import data from "emoji-mart-vue-fast/data/twitter.json";

//props(リアクション)
const props = defineProps<{
  reaction: {
    [key: string]: {
      [key: string]: number
    }
  }
}>();

/**
 * 絵文字のレンダー
 */
const emojiRender = (emojiId:string) => {
  let emojiIndex = new EmojiIndex(data);
  return emojiIndex._emojis[emojiId].native;
}

onMounted(() => {
  if (JSON.stringify(props.reaction) !== "{}") {
    console.log("EmojiReader :: reaction->", props.reaction);
  }
});
</script>

<template>
  <span>
    <v-chip v-for="(reaction,key) of props.reaction" class="pr-2">
      {{ emojiRender(key.toString()) }}
    </v-chip>
  </span>
</template>
