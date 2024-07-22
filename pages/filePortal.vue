<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import UploadFiles from '~/components/file/UploadFiles.vue';
import CreateFolder from '~/components/file/CreateFolder.vue';
import DeleteFolder from '~/components/file/DeleteFolder.vue';
import calcSizeInHumanFormat from "~/composables/calcSizeInHumanFormat";
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

import type { file, folder } from '~/types/file';

/**
 * data
 */
const fileIndex = ref<file[]>([]); //ファイルインデックス
const folderIndex = ref<folder[]>([]); //フォルダ構成データ
const currentDirectory = ref<folder>({ //今いるディレクトリのフォルダ情報
  id: '',
  userId: '',
  name: '',
  positionedDirectoryId: ''
});
const directoryIdSelected = ref<string>("");
const directoryTree = ref<folder[]>([{
  id: '',
  userId: '',
  name: '',
  positionedDirectoryId: ''
}]); //今いるディレクトリまでのフォルダツリー
const fileIdSelected =ref<string[]>([]); //選択しているファイルId配列

const displayUpload = ref<boolean>(false); //アップロード画面表示用
const displayCreateFolder = ref<boolean>(false); //フォルダ作成画面表示用
const displayDeleteFolder = ref<boolean>(false); //フォルダ削除確認画面用

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
 * フォルダを移動
 */
const moveDirectory = () => {
  console.log("filePortal :: moveDirectory : ディレクトリ移動->", directoryIdSelected.value);
  //移動先のフォルダの情報
  let folderInfoMovingTo:folder = {
    id: '',
    userId: '',
    name: '',
    positionedDirectoryId: ''
  };

  //もし今と同じディレクトリIdを選択したなら再取得するだけ
  if (directoryIdSelected.value === currentDirectory.value.id) {
    fetchFilesAndFolders();
    return;
  }

  //ディレクトリツリーで選んだのか確認、設定
    //ディレクトリツリー上の選択したフォルダIdの位置用変数
  let treeIndexMovingTo:number = -1;
  //console.log("今のツリー->", directoryTree.value);
    //選択したフォルダーが今より上にいるか調べてツリー上の位置とフォルダ情報格納
  for (let index in directoryTree.value) {
    if (directoryTree.value[index].id === directoryIdSelected.value) {
      treeIndexMovingTo = parseInt(index);
      folderInfoMovingTo = directoryTree.value[index];
      break;
    }
  }

  //もし上にいくのならツリーを削る、下ならシンプル追加
  if (treeIndexMovingTo !== -1) {
    //ツリーからsplice
    directoryTree.value.splice(treeIndexMovingTo + 1);
  } else {

    //選択Idにあたるフォルダ情報を選択フォルダ変数へ格納
    for (let index in folderIndex.value) {
      if (folderIndex.value[index].id === directoryIdSelected.value) {
        folderInfoMovingTo = folderIndex.value[index];
        break;
      }
    }

    //ディレクトリーツリーへ追加
    directoryTree.value.push(folderInfoMovingTo);
  }

  console.log("filePortal :: moveDirectory : ディレクトリツリー->", directoryTree.value);
  console.log("filePortal :: moveDirectory : フォルダ情報->", folderInfoMovingTo);

  //ディレクトリ情報を格納
  currentDirectory.value = folderInfoMovingTo;
  //ディレクトリとフォルダを再取得
  fetchFilesAndFolders();
}

/**
 * 選択したファイルIdをクリップボードへメッセに使える形でコピー
 */
const copyIdsToClipBoard = () => {
  let txt = "";
  for (let fileId of fileIdSelected.value) {
    txt += "<file:" + fileId + ">\n";
  }

  //クリップボードへ書き込み
  navigator.clipboard.writeText(txt);
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
    directory: currentDirectory.value.id
  });
  socket.emit("fetchFolders", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    positionedDirectoryId: currentDirectory.value.id
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
    <UploadFiles :currentDirectory />
  </v-dialog>

  <!-- フォルダー作成用 -->
  <v-dialog
    v-if="displayCreateFolder"
    v-model="displayCreateFolder"
    style="max-width:650px; min-width:450px; width:65vw; height:55vh; max-height:650px;"
  >
    <CreateFolder :currentDirectory />
  </v-dialog>

  <!-- フォルダー削除用 -->
  <v-dialog
    v-if="displayDeleteFolder"
    v-model="displayDeleteFolder"
    style="max-width:650px; min-width:450px; width:65vw; height:55vh; max-height:650px;"
  >
    <DeleteFolder
      @leave-and-move="
        directoryIdSelected=directoryTree[directoryTree.length-2].id;
        displayDeleteFolder=false;
        moveDirectory();
      "
      :currentDirectory
    />
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
        rounded="lg"
      />
    </span>
    <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />

    <m-card class="mt-3">
      <div class="my-2 d-flex align-center">
        <m-btn
          @click="copyIdsToClipBoard"
          variant="tonal"
          icon="mdi-content-copy"
          rounded="xl"
          size="small"
          :disabled="fileIdSelected.length===0"
        />
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

      <!-- ディレクリツリー表示、移動選択 -->
      <div class="mb-1">
        <v-chip @click="()=>{directoryIdSelected=''; moveDirectory();}" size="small">ホーム</v-chip> /
        <span v-for="folder of directoryTree">
          <span  v-if="folder.id !== ''">
            <v-chip
              @click="()=>{directoryIdSelected=folder.id; moveDirectory();}"
              size="small"
            >
              {{ folder.name }}
            </v-chip>
            /
          </span>
        </span>

        <div class="d-flex align-center my-2">
          <m-btn @click="displayCreateFolder = true" icon="mdi-plus" size="small"></m-btn>
          <v-select
            v-model="directoryIdSelected"
            @update:modelValue="moveDirectory"
            label="ディレクトリ"
            density="compact"
            variant="outlined"
            :items="folderIndex"
            item-title="name"
            item-value="id"
            hide-details
          ></v-select>
          <m-btn
            @click="displayDeleteFolder=true"
            icon="mdi-delete"
            color="error"
            size="small"
            variant="outlined"
          />
        </div>

      </div>

      <v-data-table
        v-model="fileIdSelected"
        :items="fileIndex"
        item-value="id"
        :headers="header"
        hide-default-footer
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