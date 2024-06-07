<script setup lang="ts">
import type message from '~/types/message';

const props = defineProps<{linkData: message["linkData"]}>();

/**
 * リンクプレビューデータJSONのキーを配列にしたものを返す
 */
const linkDataKeyArr = computed(():string[] => {
  //リンクデータがnullなら空
  if (props.linkData === null) return [];
  return Object.keys(props.linkData);
});
</script>

<template>
  <span
    v-for="index of linkDataKeyArr"
    v-if="props.linkData!==null"
  >
    <!-- 通常ウェブサイト用 -->
    <m-card v-if="props.linkData[index].contentType==='text/html'" color="cardInner">
      {{ props.linkData[index].title }} 
      {{ props.linkData[index].images }}
    </m-card>

    <!-- 画像用 -->
    <span v-if="props.linkData[index].mediaType==='image'">
      {{ props.linkData[index].url }}
    </span>
  </span>
</template>
