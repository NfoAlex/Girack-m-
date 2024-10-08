<script setup lang="ts">
import type message from "~/types/message";
import ImageViewer from "./ImageViewer.vue";

const props = defineProps<{ linkData: message["linkData"] }>();

/**
 * data
 */
const displayImageViewer = ref<boolean>(false);
const activeImageUrl = ref<string>("");

/**
 * リンクプレビューデータJSONのキーを配列にしたものを返す
 */
const linkDataKeyArr = computed((): string[] => {
  //リンクデータがnullなら空
  if (props.linkData === null) return [];
  return Object.keys(props.linkData);
});

/**
 * エラーハンドラ
 */
onErrorCaptured((err, instance, info) => {
  console.log("LinkPreview :: erron->", props.linkData);
  console.log("LinkPreview :: err->", err);

  return false;
});
</script>

<template>

  <ImageViewer
    v-if="displayImageViewer"
    v-model="displayImageViewer"
    @closeDialog="displayImageViewer=false"
    :imageUrls="[activeImageUrl]"
    :indexSelected="0"
  />

  <span
    v-for="index of linkDataKeyArr"
    v-if="props.linkData!==null"
  >
    <!-- 通常ウェブサイト用 -->
    <m-card
      v-if="props.linkData[index].contentType==='text/html'"
      color="cardInner"
      class="d-flex mt-1"
      style="max-height:200px; max-width:800px; width:fit-content;"
    >

      <span class="flex-shrink-1 flex-grow-1" style="overflow-y:auto; max-height:90%">
        <span class="d-flex" style="width:100%;">
          <span
            v-if="props.linkData[index].favicon !== undefined"
            style="max-width:50px;"
            class="mr-1 mt-1"
          >
            <v-img
              width="20px"
              height="auto"
              :src="props.linkData[index].favicon"
            />
          </span>
          <a :href="linkData[index].url" rel="noopener noreferrer" target="_blank">
            <span v-if="props.linkData[index].title !== undefined">
              {{ props.linkData[index].title.length>50
                ? 
                  props.linkData[index].title.slice(0,50) + "..."
                  :
                  props.linkData[index].title
              }}
            </span>
          
          </a>
        </span>
        <v-divider />
        <span class="text-disabled" style="overflow-y:scroll; height:10px;">
          {{ props.linkData[index].description }}
        </span>
      </span>

      <span
        v-if="props.linkData[index].images[0] !== undefined"
        class="rounded-lg flex-grow-1 flex-shrink-0 d-flex flex-column align-center my-auto ml-3"
        style="height:auto; max-width:40%; border-radius:24px;"
      >
        <NuxtImg
          :src="props.linkData[index].images[0].url"
          @click="activeImageUrl=props.linkData[index].images[0].url; displayImageViewer=true;"
          :modifiers="{ quality: 50, }"
          style="max-width:97.5%; height:auto; max-height:190px; border-radius: 20px !important;"
          :height="170"
          class="cursor-pointer"
        />
      </span>

    </m-card>

    <!-- 画像単体用 -->
    <span v-if="props.linkData[index].mediaType==='image'" >
      <NuxtImg
        :src="props.linkData[index].url"
        @click="activeImageUrl=props.linkData[index].url; displayImageViewer=true;"
        :modifiers="{ quality: 65 }"
        style="max-height:150px; width:auto"
        :height="150"
        class="cursor-pointer rounded-xl mt-1"
      />
    </span>
  </span>
</template>
