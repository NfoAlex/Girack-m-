<script setup lang="ts">
import calcSizeInHumanFormat from "~/composables/calcSizeInHumanFormat";
import { useFileInfo } from "~/stores/FileInfo";
import { useMyUserinfo } from "~/stores/userinfo";
import ImageViewer from "./ImageViewer.vue";
const { getFileInfoSingle } = useFileInfo();

const propsMessage = defineProps<{
  fileId: string[];
}>();

/**
 * data
 */
const fileBlobArr = ref<{
  [key: string]: {
    fileName: string;
    blobUrl: string | null;
  };
}>({});
const displayImageViewer = ref<boolean>(false);
const imageViewingIndex = ref<number>(0);
const imageUrls = ref<string[]>([]);

/**
 * ファイルをダウンロードする
 * @param fileId
 */
const downloadFile = (fileId: string) => {
  //仮想ボタン用のアンカーオブジェクト
  const link = document.createElement("a");
  
  //ダウンロードするための仮想ボタン作成(見えない)
  link.href = "/downloadfile/" + fileId;
  link.download = getFileInfoSingle(fileId).name;
  link.style.display = "none";

  console.log("ダウンロードに使う名前->", link.download, " 情報->", getFileInfoSingle(fileId));

  if (link.href === "/downloadfile/") return;

  //ブラウザにダウンロードさせる
  document.body.appendChild(link);
  link.click();

  //掃除
  document.body.removeChild(link);
};

</script>

<template>
  <ImageViewer
    v-if="displayImageViewer"
    v-model="displayImageViewer"
    @closeDialog="displayImageViewer=false"
    :imageUrls
    :indexSelected="imageViewingIndex"
  />

  <div class="d-flex flex-wrap align-center" style="width:100%;">
    <span
      v-for="fileId,index in propsMessage.fileId"
      style="width:100%;"
      class="mr-1 mt-1"
    >
      <!-- 通常ファイル表示 -->
      <m-card
        v-if="!getFileInfoSingle(fileId).type.startsWith('image/')"
        color="cardInner"
        class="mt-1 d-flex flex-column"
        max-width="100%"
      >

        <span class="mt-1 d-flex align-center" style="max-height:150px;">
          <v-icon
            v-if="!getFileInfoSingle(fileId).isDelete"
            class="mr-1"
          >mdi-folder</v-icon>
          <v-icon
            v-else
            class="mr-1"
          >mdi-delete</v-icon>

          <a
            v-if="!getFileInfoSingle(fileId).isDelete"
            :href="'/file/' + getFileInfoSingle(fileId).id"
            rel="noopener noreferrer" target="_blank"
            class="text-truncate flex-shrink-1"
          >
            {{ getFileInfoSingle(fileId).name }}
          </a>
          <p v-if="getFileInfoSingle(fileId).isDelete" class="text-disabled">このファイルは削除されています。</p>

          <m-btn
            v-if="!getFileInfoSingle(fileId).isDelete"
            @click="downloadFile(getFileInfoSingle(fileId).id)"
            icon="mdi-download"
            variant="text"
            size="small"
            class="ml-auto"
          />

          <v-chip
            v-if="!getFileInfoSingle(fileId).isDelete"
            size="small"
            class="flex-shrink-0"
          >{{ calcSizeInHumanFormat(getFileInfoSingle(fileId).size) }}</v-chip>
        </span>
      </m-card>

      <!-- 画像表示 -->
      <img
        v-else
        @click="imageViewingIndex=index, displayImageViewer=true"
        :src="'/downloadfile/' + fileId"
        placeholderClass="ImagePlaceHolder"
        class="rounded-lg cursor-pointer"
        width="fit-content"
        style="max-height:150px; max-width:100%;"
        loading="lazy"
      />
    </span>
  </div>
</template>

<style scoped>
.ImagePlaceHolder {
  height: 150px;
  width: 50%;
}
</style>