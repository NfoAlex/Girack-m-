<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import calcSizeInHumanFormat from '~/composables/calcSizeInHumanFormat';
import { useMyUserinfo } from '~/stores/userinfo';
import type { file } from '~/types/file';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

const propsMessage = defineProps<{
  fileId: string[]
}>();

/**
 * data
 */
const fileInfo = ref<file[]>([]);

/**
 * ファイル情報受け取り
 */
const SOCKETfetchFileInfo = (dat:{result:string, data:file}) => {
  console.log("FileDataPreview :: dat->", dat);
  if (dat.result === "SUCCESS") {
    fileInfo.value.push(dat.data);
  }
}

onMounted(() => {
  for (let fileId of propsMessage.fileId) {
    console.log("FIleDataPreview :: fileId->", fileId);

    socket.on("RESULT::fetchFileInfo:" + fileId, SOCKETfetchFileInfo);

    socket.emit("fetchFileInfo", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value
      },
      fileId: fileId
    });
  }
});

onUnmounted(() => {
  for (let fileId of propsMessage.fileId) {
    socket.off("RESULT::fetchFileInfo:" + fileId, SOCKETfetchFileInfo);
  }
});
</script>

<template>
  <span v-for="file in fileInfo">
    <m-card
      color="cardInner"
      class="mt-1 d-flex align-center"
      style="max-height:150px;"
    >
      <v-icon class="mr-1">mdi-folder</v-icon>
      <p class="text-truncate flex-shrink-1">{{ file.name }}</p>
      <v-chip size="small" class="ml-auto">{{ calcSizeInHumanFormat(file.size) }}</v-chip>
    </m-card>
  </span>
</template>