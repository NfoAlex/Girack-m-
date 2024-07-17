<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

import type { folder } from '~/types/file';

const props = defineProps<{
  currentDirectory: folder
}>();

/**
 * フォルダーを削除する
 */
const deleteFolder = () => {
  socket.emit("deleteFolder", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    folderId: props.currentDirectory.id
  });
}

/**
 * フォルダー作成結果受け取り
 */
const SOCKETdeleteFolder = (dat:{result:string, dat:null}) => {
  console.log("SOCKETdeleteFolder :: dat->", dat);
}

onMounted(() => {
  socket.on("RESULT::deleteFolder", SOCKETdeleteFolder);
});

onUnmounted(() => {
  socket.off("RESULT::deleteFolder", SOCKETdeleteFolder);
});
</script>

<template>
  <m-card>
    <v-card-title>
      フォルダーの削除
    </v-card-title>

    <v-card-text>
      <p>本当にこのフォルダーを削除しますか？</p>
      <p>中に含まれるファイルとフォルダまで全て削除されます。</p>
      <m-card color="cardInner" class="mt-3">
        <p class="text-center text-h5">{{ props.currentDirectory.name }}</p>
      </m-card>
    </v-card-text>

    <p class="text-center mt-5 text-disabled text-subtitle-2">ダブルクリックで削除</p>
    <v-card-actions>
      <m-btn class="mx-auto" @dblclick="deleteFolder" color="error" block>
        削除する
      </m-btn>
    </v-card-actions>
  </m-card>
</template>