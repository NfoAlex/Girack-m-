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
  try {
    let emojiIndex = new EmojiIndex(data);
    return emojiIndex._emojis[emojiId].native;
  } catch(e) {
    console.log("EmojiReader :: onMounted : e->", e);
  }
}

onMounted(() => {
  if (JSON.stringify(props.reaction) !== "{}") {
    //console.log("EmojiReader :: onMounted : reaction->", props.reaction);
    //console.log("EmojiReader :: onMounted : data->", data);
  }
});
</script>

<template>
  <span>
    <v-chip
      v-for="(reaction,key) of props.reaction"
      class="mr-1" 
      :key="key"
    >
      {{ emojiRender(key.toString()) }}
    </v-chip>
  </span>
</template>
