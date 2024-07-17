<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import UploadFiles from '~/components/file/UploadFiles.vue';
import CreateFolder from '~/components/file/CreateFolder.vue';
import calcSizeInHumanFormat from "~/composables/calcSizeInHumanFormat";
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

import type { file, folder } from '~/types/file';

/**
 * data
 */
const fileIndex = ref<file[]>([]);
const folderIndex = ref<any[]>([]);
const currentDirectory = ref<string>("");
const fileIdSelected =ref<string[]>([]);

const fileItems = ref<any[]>([]);
const displayUpload = ref<boolean>(false);
const displayCreateFolder = ref<boolean>(false);

//ファイルインデックス表示ヘッダ
const header = [
  { title: 'ファイル名', value:'name' },
  { title: 'サイズ', key:"size", value: (item: file) => calcSizeInHumanFormat(item.size) },  // サイズを単位で表示
  { title: 'アップロード日時', key:"uploadedDate", value: (item: file) => new Date(item.uploadedDate).toLocaleString() },  // 日付をフォーマットして表示
];

/**
 * 選択したファイルを削除する
 */
const deleteSelectedFile = () => {
  for (let fileId of fileIdSelected.value) {
    console.log("filePortal :: deleteSelectedFile : 消そうとしているファイル->", fileId);
    socket.emit("deleteFile", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value
      },
      fileId: fileId
    });
  }
}

/**
 * ファイルとフォルダ構成を取得
 */
const fetchFilesAndFolders = () => {
  //ファイルインデックスを取得
  socket.emit("fetchFileIndex", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    directory: currentDirectory.value
  });
  socket.emit("fetchFolders", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
}

/**
 * ファイルインデックス受け取り
 * @param dat 
 */
const SOCKETfetchFileIndex = (dat:{result:string, data:file[]}) => {
  console.log("filePortal :: dat->", dat);
  //成功ならファイルインデックスを格納
  if (dat.result === "SUCCESS") {
    fileIndex.value = dat.data;
  }
}

/**
 * フォルダ構成の受け取り
 * @param dat 
 */
const SOCKETfetchFolders = (dat:{result:string, data:folder[]}) => {
  console.log("fetchFolders :: dat->", dat);
  if (dat.result === "SUCCESS") {
    folderIndex.value = dat.data;
  }
};

/**
 * ファイルインデックス受け取り
 * @param dat 
 */
const SOCKETdeleteFile = (dat:{result:string, data:null}) => {
  console.log("deleteFile :: dat->", dat);
  if (dat.result === "SUCCESS") {
    //ファイルインデックスを取り直す
    socket.emit("fetchFileIndex", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value
      }
    });
  }
}

onMounted(() => {
  socket.on("RESULT::fetchFileIndex", SOCKETfetchFileIndex);
  socket.on("RESULT::fetchFolders", SOCKETfetchFolders);
  socket.on("RESULT::deleteFile", SOCKETdeleteFile);

  //ファイルインデックスを取得
  fetchFilesAndFolders();
});

onUnmounted(() => {
  socket.off("RESULT::fetchFileIndex", SOCKETfetchFileIndex);
  socket.off("RESULT::fetchFolders", SOCKETfetchFolders);
  socket.off("RESULT::deleteFile", SOCKETdeleteFile);
});

</script>

<template>
  <!-- ファイルアップロード用 -->
  <v-dialog
    v-if="displayUpload"
    v-model="displayUpload"
    style="max-width:750px; width:85vw; height:75vh; max-height:650px;"
  >
    <UploadFiles />
  </v-dialog>

  <!-- フォルダー作成用 -->
  <v-dialog
    v-if="displayCreateFolder"
    v-model="displayCreateFolder"
    style="max-width:650px; min-width:450px; width:65vw; height:55vh; max-height:650px;"
  >
    <CreateFolder />
  </v-dialog>

  <div class="pt-5 px-5 d-flex flex-column" style="height:100%;">
    <span class="d-flex align-center">
      <p
        class="text-h5"
        style="font-weight:700;"
      >ファイルポータル</p>
      <m-btn
        @click="fetchFilesAndFolders"
        icon="mdi-refresh"
        class="ml-auto"
        color="primary"
        rounded="xl"
      />
    </span>
    <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />

    <m-card class="mt-3">
      <div class="my-2 d-flex align-center">
        <m-btn @click="displayCreateFolder = true" variant="text">
          新しいフォルダ
        </m-btn>
        <m-btn
          @click="deleteSelectedFile"
          class="mx-2 ml-auto"
          variant="outlined"
          color="error"
          :disabled="fileIdSelected.length===0"
        >
          <v-icon>mdi-delete</v-icon>
          {{ fileIdSelected.length }}個 
          <p>削除する</p>
        </m-btn>
      </div>

      <v-data-table
        v-model="fileIdSelected"
        :items="fileIndex"
        item-value="id"
        :headers="header"
        show-select
      ></v-data-table>
    </m-card>

  </div>

  <!-- アップロードボタン -->
  <v-btn
    @click="displayUpload = true"
    position="absolute"
    style="right:5%; bottom: 5%;"
    color="primary"
    icon="mdi:mdi-plus"
    size="x-large"
    rounded="lg"
  />
</template>