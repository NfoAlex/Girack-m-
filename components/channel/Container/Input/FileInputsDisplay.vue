<script setup lang="ts">
import { useMyUserinfo } from '~/stores/userinfo';
import FileItem from './FileInputsDisplay/FileItem.vue';
import type { file } from '~/types/file';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

const props = defineProps<{
  fileInput: File[],
  channelId: string
}>();

const emits = defineEmits<{
  (e:"trimFile", index:number):void, //指定ファイルの入力を削除
  (e:"updateFileIdArr", fileIdArr:string[]):void, //親のファイルId配列を更新する
}>();

/**
 * data
 */
const fileIdArrNow = ref<string[]>([]);

</script>

<template>
  <div
    style="overflow-x:auto;"
  >
    <span style="width:max-content" class="d-flex flex-row">
      <m-card-compact
        v-for="(file,index) in fileInput"
        class="d-flex flex-row align-center pl-3 py-1 mr-1"
        variant="tonal"
      >
        <FileItem
          :fileInput="file"
          :channelId="props.channelId"
          @appendFileId="fileId => {
            fileIdArrNow.push(fileId);
            emits('updateFileIdArr', fileIdArrNow); //親にファイルId配列を更新させる
          }"
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