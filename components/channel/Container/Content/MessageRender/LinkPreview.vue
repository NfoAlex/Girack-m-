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
    <m-card
      v-if="props.linkData[index].contentType==='text/html'"
      color="cardInner"
      class="d-flex"
      style="max-height:200px;"
    >
      <span
        v-if="props.linkData[index].images[0] !== undefined"
        class="rounded-lg flex-grow-1 flex-shrink-0 d-flex flex-column align-center mr-3"
        style="height:100%; width:40%; max-width:250px; border-radius:24px;"
      >
        <v-img :src="props.linkData[index].images[0].url" style="width:100%;" rounded="xl">
        </v-img>
      </span>
      <span class="flex-shrink-1" style="overflow-y:scroll; height:100px;">
        <a :href="linkData[index].url" rel="noopener noreferrer" target="_blank">
          <span v-if="props.linkData[index].title !== undefined">
            {{ props.linkData[index].title.length>30
              ? 
                props.linkData[index].title.slice(30) + "..."
                :
                props.linkData[index].title
            }}
          </span>
        </a>
        <v-divider />
        <span class="text-disabled" style="overflow-y:scroll; height:10px;">
          {{ props.linkData[index].description }}
        </span>
      </span>
    </m-card>

    <!-- 画像用 -->
    <span v-if="props.linkData[index].mediaType==='image'">
      {{ props.linkData[index].url }}
    </span>
  </span>
</template>
