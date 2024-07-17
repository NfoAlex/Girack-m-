<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const inputFolderName = ref<string>("");

/**
 * フォルダーを作成
 */
const createFolder = () => {
  socket.emit("createFolder", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    folderName: inputFolderName.value,
    directory: ""
  });
}

/**
 * フォルダー作成結果受け取り
 */
const SOCKETcreateFolder = (dat:{result:string, dat:null}) => {
  console.log("SOCKETcreateFolder :: dat->", dat);
}

onMounted(() => {
  socket.on("RESULT::createFolder", SOCKETcreateFolder);
});

onUnmounted(() => {
  socket.off("RESULT::createFolder", SOCKETcreateFolder);
});
</script>

<template>
  <m-card>
    <v-card-title>
      フォルダー作成
    </v-card-title>

    <v-card-text>
      <v-text-field
        v-model="inputFolderName"
        variant="outlined"
        label="フォルダ名"
      />
    </v-card-text>

    <v-card-actions>
      <m-btn @click="createFolder" color="primary">
        作成
      </m-btn>
    </v-card-actions>
  </m-card>
</template>