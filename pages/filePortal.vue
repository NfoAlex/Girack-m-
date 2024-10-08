<script setup lang="ts">
import CreateFolder from "~/components/file/CreateFolder.vue";
import DeleteFolder from "~/components/file/DeleteFolder.vue";
import ImagePreview from "~/components/file/ImagePreview.vue";
import UploadFiles from "~/components/file/UploadFiles.vue";
import calcSizeInHumanFormat from "~/composables/calcSizeInHumanFormat";
import { socket } from "~/socketHandlers/socketInit";
import { useChannelinfo } from "~/stores/channel";
import { useServerinfo } from "~/stores/serverinfo";
import { useMyUserinfo } from "~/stores/userinfo";
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getServerinfo } = storeToRefs(useServerinfo());
const { getChannelinfoSingle } = useChannelinfo();

import type { file, folder } from "~/types/file";

//ファイルインデックス表示ヘッダ
const header = [
  { title: "ファイル名", value: "name" },
  {
    title: "プレビュー",
    key: "preview",
    value: (item: file) => (item.type.startsWith("image/") ? item.id : null),
  },
  {
    title: "公開設定",
    key: "isPublic",
    value: (item: file) => (item.isPublic ? "公開" : "-"),
  },
  {
    title: "サイズ",
    key: "size",
    value: (item: file) => calcSizeInHumanFormat(item.size),
  }, // サイズを単位で表示
  {
    title: "アップロード日時",
    key: "uploadedDate",
    value: (item: file) => new Date(item.uploadedDate).toLocaleString(),
  }, // 日付をフォーマットして表示
];

/**
 * data
 */
const storageSize = ref<number>(0); //ファイル全体の容量
const fileIndex = ref<file[]>([]); //ファイルインデックス
const folderIndex = ref<folder[]>([]); //フォルダ構成データ
const fileSelected = ref<file[]>([]); //選択したファイル項目
const directoryTree = ref<//ディレクトリツリー
{
  [key: string]: folder[];
}>({
  "0": [
    {
      id: "",
      userId: "",
      name: "home",
      positionedDirectoryId: "",
    },
  ],
});

const currentDirectory = ref<folder>({
  //今いるディレクトリ情報
  id: "",
  userId: "",
  name: "home",
  positionedDirectoryId: "",
});

const displayUpload = ref<boolean>(false); //アップロード画面表示用
const displayCreateFolder = ref<boolean>(false); //フォルダ作成画面表示用
const displayDeleteFolder = ref<boolean>(false); //フォルダ削除確認画面用

/**
 * ディレクトリを移動して再取得
 */
const moveDirectory = (folder: folder, directoryLevel: string) => {
  //現在いるディレクトリを子往診
  currentDirectory.value = folder;

  trimFolderLevel(directoryLevel);

  //ファイルとフォルダを再取得
  fetchFilesAndFolders();
};

/**
 * ディレクトリツリーを削る
 * @param directoryLevel
 */
const trimFolderLevel = (directoryLevel: string) => {
  //ディレクトリーツリーの深さ取得
  const lengthOfDirectoryTree = Object.keys(directoryTree.value).length;

  let directoryLevelReal = directoryLevel;

  //-1なら同じ階層までディレクトリツリーを削り取得しなおす
  if (directoryLevel === "-1") {
    directoryLevelReal = (lengthOfDirectoryTree - 2).toString();
    fetchFilesAndFolders();
  }

  //ディレクトリーツリーから移動先の深さより下のものを削除
  for (
    let i = Number.parseInt(directoryLevelReal) + 1;
    i <= lengthOfDirectoryTree;
    i++
  ) {
    delete directoryTree.value[i];
  }
};

/**
 * 選択したファイルを削除する
 */
const deleteSelectedFile = () => {
  for (const file of fileSelected.value) {
    /*
    console.log(
      "filePortal :: deleteSelectedFile : 消そうとしているファイル->",
      file,
    );
    */
    socket.emit("deleteFile", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value,
      },
      fileId: file.id,
    });
  }

  //選択したファイル一覧を初期化
  fileSelected.value = [];
};

/**
 * 選択したファイルの公開設定をトグル
 */
const toggleFileIsPublic = () => {
  //選択したファイルの数分
  for (const file of fileSelected.value) {
    socket.emit("toggleFileIsPublic", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value,
      },
      fileId: file.id,
    });
  }
};

/**
 * 選択したファイルをクリップボードへURLをコピー
 */
const copyUrlsToClipBoard = () => {
  let urls = "";

  for (const file of fileSelected.value) {
    urls += `${window.location.origin}/file/${file.id}\n`;
  }

  //クリップボードへ書き込み
  navigator.clipboard.writeText(urls);
};

/**
 * ファイルとフォルダ構成を取得
 */
const fetchFilesAndFolders = () => {
  //ファイルインデックスを取得
  socket.emit("fetchFileIndex", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    directory: currentDirectory.value.id,
  });
  socket.emit("fetchFolders", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    positionedDirectoryId: currentDirectory.value.id,
  });
};

/**
 * ファイルインデックス受け取り
 * @param dat
 */
const SOCKETfetchFileIndex = (dat: { result: string; data: file[] }) => {
  //console.log("RemoteFileSelect :: dat->", dat);
  //成功ならファイルインデックスを格納
  if (dat.result === "SUCCESS") {
    fileIndex.value = dat.data;

    //使用容量を再取得
    socket.emit("calcFullFolderSize", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value,
      },
    });
  }
};

/**
 * フォルダ構成の受け取り
 * @param dat
 */
const SOCKETfetchFolders = (dat: { result: string; data: folder[] }) => {
  //console.log("RemoteFileSelect :: dat->", dat);
  if (dat.result === "SUCCESS") {
    folderIndex.value = dat.data;

    //ディレクトリーツリーの長さ取得
    const lengthOfDirectoryTree = Object.keys(directoryTree.value).length;

    //フォルダデータの最初と現階層の最初が同じフォルダなら上書き
    if (
      dat.data[0] ===
      directoryTree.value[(lengthOfDirectoryTree - 1).toString()][0]
    ) {
      //今いる階層に上書き
      directoryTree.value[(lengthOfDirectoryTree - 1).toString()] = dat.data;
    } else {
      //その長さの数に代入する
      directoryTree.value[lengthOfDirectoryTree.toString()] = dat.data || [];
    }
  }
};

/**
 * ストレージの使用状況を受け取る
 * @param dat
 */
const SOCKETcalcFullFolderSize = (dat: {
  result: string;
  data: number | null;
}) => {
  //console.log("filePortal :: SOCKETcalcFullFolderSize : dat->", dat);
  if (dat.data !== null) {
    storageSize.value = dat.data;
  }
};

/**
 * ファイルの公開設定のトグルを受け取る
 * @param dat
 */
const SOCKETtoggleFileIsPublic = (dat: { result: string; data: string }) => {
  //console.log("filePortal :: SOCKETtoggleFileIsPublic : dat->", dat);

  //成功なら結果を適用させる
  if (dat.result === "SUCCESS") {
    //ループして該当ファイルを探して公開設定をトグル
    for (const index in fileIndex.value) {
      if (fileIndex.value[index].id === dat.data) {
        fileIndex.value[index].isPublic = !fileIndex.value[index].isPublic;
      }
    }
  }
};

/**
 * ファイルインデックス受け取り
 * @param dat
 */
const SOCKETdeleteFile = (dat: { result: string; data: null }) => {
  //console.log("deleteFile :: dat->", dat);
  if (dat.result === "SUCCESS") {
    //ファイルインデックスを取り直す
    socket.emit("fetchFileIndex", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value,
      },
      directory: currentDirectory.value.id,
    });
  }
};

onMounted(() => {
  socket.on("RESULT::fetchFileIndex", SOCKETfetchFileIndex);
  socket.on("RESULT::fetchFolders", SOCKETfetchFolders);
  socket.on("RESULT::calcFullFolderSize", SOCKETcalcFullFolderSize);
  socket.on("RESULT::deleteFile", SOCKETdeleteFile);
  socket.on("RESULT::toggleFileIsPublic", SOCKETtoggleFileIsPublic);

  //ファイルインデックスを取得
  fetchFilesAndFolders();
});

onUnmounted(() => {
  socket.off("RESULT::fetchFileIndex", SOCKETfetchFileIndex);
  socket.off("RESULT::fetchFolders", SOCKETfetchFolders);
  socket.off("RESULT::calcFullFolderSize", SOCKETcalcFullFolderSize);
  socket.off("RESULT::deleteFile", SOCKETdeleteFile);
  socket.off("RESULT::toggleFileIsPublic", SOCKETtoggleFileIsPublic);
});
</script>

<template>
  <!-- ファイルアップロード用 -->
  <v-dialog
    v-if="displayUpload"
    v-model="displayUpload"
    style="max-width:750px; width:85vw; height:75vh; max-height:650px;"
  >
    <UploadFiles 
      @closeDialog="displayUpload = false;"
      :currentDirectory
    />
  </v-dialog>

  <!-- フォルダー作成用 -->
  <v-dialog
    v-if="displayCreateFolder"
    v-model="displayCreateFolder"
    style="max-width:650px; min-width:450px; width:65vw; height:55vh; max-height:650px;"
  >
    <CreateFolder
      @trimFolderLevel="
        trimFolderLevel('-1');
        displayCreateFolder = false;
      "
      :currentDirectory
    />
  </v-dialog>

  <!-- フォルダー削除用 -->
  <v-dialog
    v-if="displayDeleteFolder"
    v-model="displayDeleteFolder"
    style="max-width:650px; min-width:450px; width:65vw; height:55vh; max-height:650px;"
  >
    <DeleteFolder
      @leaveAndMove="
        displayDeleteFolder=false;
        console.log('filePortal :: folder->',
          ' level->',
          (Object.keys(directoryTree).length-1).toString()
        );
        moveDirectory(directoryTree[Object.keys(directoryTree).length-3][0], (Object.keys(directoryTree).length-3).toString());
      "
      :currentDirectory
    />
  </v-dialog>

  <div class="pt-5 px-5 pb-5 d-flex flex-column" style="height:100%;">
    <span class="d-flex align-center">
      <p
        class="text-h5"
        style="font-weight:700;"
      >ファイルポータル</p>

      <v-chip class="ml-3" color="orange">
        <v-icon>mdi-test-tube</v-icon>
        テスト
      </v-chip>

      <m-btn
        @click="
          moveDirectory(currentDirectory, (Object.keys(directoryTree).length-2).toString())
        "
        icon="mdi-refresh"
        class="ml-auto"
        color="primary"
        rounded="lg"
      />
    </span>
    <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />

    <!-- 容量の使用状況表示 -->
    <div class="my-4">
      <p class="text-right text-h5">使用状況 : {{ calcSizeInHumanFormat(storageSize) }} / {{ calcSizeInHumanFormat(getServerinfo.config.STORAGE.StorageSizeLimit) }}</p>
      <v-progress-linear
        :model-value="storageSize / getServerinfo.config.STORAGE.StorageSizeLimit * 100"
        class="mt-2 mx-1"
        rounded
      />
    </div>

    <!-- ディレクトリ選択画面 -->
    <m-card
      class=""
      variant="outlined"
      height="20%"
      minHeight="200px"
      width="100%"
    >
      <div class="d-flex flex-row overflow-x-auto" style="width:100%; height:100%;">
        <!-- ディレクトリの中身のフォルダ表示部分 -->
        <div
          v-for="directory,index in directoryTree"
          class="flex-shrink-0 d-flex flex-row mr-2"
          style="width:25%; max-width:250px; height:100%;"
        >
          <!-- 一つのディレクトリ一覧 -->
          <div
            class="flex-grow-1 d-flex flex-column mr-2 overflow-y-auto"
          >
            <!-- フォルダそのもの -->
            <m-card-compact
              @click="moveDirectory(folderInfo, index.toString())"
              v-for="folderInfo in directory"
              class="px-3 py-2 mb-1 flex-shrink-0"
              :color="currentDirectory.id === folderInfo.id ?'primary':null"
            >
              <!-- フォルダ名表示 -->
              <span v-if="!folderInfo.id.startsWith('C')">{{ folderInfo.name }}</span>
              <!-- チャンネル用だった時のチャンネル名表示 -->
              <span v-else class="mx-auto d-flex align-center">
                <v-icon size="small" class="mr-1">mdi-pound</v-icon>
                <p class="text-truncate">{{ getChannelinfoSingle(folderInfo.id.slice(1,5)).channelName }}</p>
              </span>
            </m-card-compact>
          </div>

          <v-divider :thickness="2" vertical />
        </div>

      </div>
    </m-card>

    <!-- ファイル用ツールバー -->
    <m-card
      class="flex-shrink-0 mt-3 d-flex align-center overflow-x-auto"
      width="100%"
      color="surface"
    >

      <m-btn
        @click="displayUpload=true"
        icon="mdi-upload"
        size="small"
        color="primary"
      >
        <v-icon>mdi-upload</v-icon>
        <v-tooltip activator="parent" location="top">ファイルをアップロード</v-tooltip>
      </m-btn>

      <m-btn
        @click="displayCreateFolder=true"
        variant="tonal"
        icon="mdi-folder-plus-outline"
        size="small"
      >
        <v-icon>mdi-folder-plus-outline</v-icon>
        <v-tooltip activator="parent" location="top">フォルダを作成する</v-tooltip>
      </m-btn>

      <v-divider vertical class="mx-3" />

      <v-chip variant="outlined" class="flex-shrink-0">
        選択 : {{ fileSelected.length }}
      </v-chip>

      <m-btn
        @click="copyUrlsToClipBoard"
        :disabled="fileSelected.length === 0"
        variant="text"
        class="ml-2"
        icon="mdi-link-variant"
        size="small"
      >
        <v-icon>mdi-link-variant</v-icon>
        <v-tooltip activator="parent" location="top">ファイルのURLをコピーする</v-tooltip>
      </m-btn>

      <m-btn
        @click="toggleFileIsPublic"
        :disabled="fileSelected.length === 0"
        icon="mdi-folder-account-outline"
        variant="text"
        size="small"
      >
        <v-icon>mdi-folder-account-outline</v-icon>
        <v-tooltip activator="parent" location="top">公開設定を切り替える（トグル）</v-tooltip>
      </m-btn>

      <m-btn
        @click="deleteSelectedFile"
        :disabled="fileSelected.length === 0"
        variant="text"
        class="ml-auto"
        color="error"
        size="small"
      >
        <v-icon>mdi-delete</v-icon>
        ファイルを削除
      </m-btn>

      <m-btn
        @click="displayDeleteFolder=true"
        variant="text"
        color="error"
        size="small"
      >
        <v-icon>mdi-folder-remove-outline</v-icon>
        フォルダを削除
      </m-btn>
    </m-card>

    <!-- ファイル表示 -->
    <v-data-table
      v-model="fileSelected"
      class="flex-grow-1 flex-shrink-1 rounded-xl mt-3 overflow-x-auto"
      :items="fileIndex"
      return-object
      :headers="header"
      hide-default-footer
      show-select
    >
      <template v-slot:item.preview="{ value }">
        <!-- 画像プレビューする -->
        <ImagePreview v-if="value !== null" :fileId="value" class="text-center" />
        <p v-else class="text-center">-</p>
      </template>
    </v-data-table>

    <!-- 選択したファイル表示 -->
    <div class="flex-shrink-0 mt-2 d-flex flex-wrap">
      <v-chip
        v-for="file in fileSelected"
        size="small"
        class="mr-1 mt-1"
      >
        {{ file.name }}
      </v-chip>
    </div>
  </div>
</template>