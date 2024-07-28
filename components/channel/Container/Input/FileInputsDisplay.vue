<script setup lang="ts">
import { useMyUserinfo } from "~/stores/userinfo";
import type { file } from "~/types/file";
import FileItem from "./FileInputsDisplay/FileItem.vue";
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

const props = defineProps<{
  fileData: {
    fileId: string;
    fileBuffer: File | null;
    fileInfo: file | null;
    uploadedFrom: "remote" | "local";
    ready: boolean;
  }[];
  channelId: string;
}>();

const emits = defineEmits<{
  (e: "trimFile", index: number): void; //指定ファイルの入力を削除
  (
    //親のファイルId配列を更新する
    e: "updateFileData",
    args: {
      fileData: {
        fileId: string;
        fileBuffer: File | null;
        fileInfo: file | null;
        uploadedFrom: "remote" | "local";
        ready: boolean;
      };
      index: number;
    },
  ): void;
}>();
</script>

<template>
  <div
    style="overflow-x:auto;"
  >
    <span style="width:max-content" class="d-flex flex-row">
      <m-card-compact
        v-for="(file,index) in props.fileData"
        class="d-flex flex-row align-center pl-3 py-1 mr-1"
        variant="tonal"
      >
        <FileItem
          :fileInput="file"
          :channelId="props.channelId"
          @updateFileData="
            fileDataNew=> {
              emits('updateFileData', {fileData:fileDataNew, index:index})
            }
          "
        />
        <m-btn
          @click="emits('trimFile',index)"
          size="x-small"
          icon="mdi-delete"
        />
      </m-card-compact>
    </span>
  </div>
</template>