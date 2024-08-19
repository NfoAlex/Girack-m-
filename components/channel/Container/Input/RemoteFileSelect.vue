<script setup lang="ts">
import ImagePreview from "~/components/file/ImagePreview.vue";
import { socket } from "~/socketHandlers/socketInit";
import { useChannelinfo } from "~/stores/channel";
import { useMyUserinfo } from "~/stores/userinfo";
import type { file, folder } from "~/types/file";
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getChannelinfoSingle } = useChannelinfo();

interface inputFileSelected {
  fileId: string;
  fileBuffer: File | null;
  fileInfo: file | null;
  uploadedFrom: "remote" | "local";
  ready: boolean;
}

//emit(選択したファイル適用のため)
const emits =
  defineEmits<
    (e: "applySelectedFile", fileSelectedResult: inputFileSelected[]) => void
  >();

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

/**
 * ディレクトリを移動して再取得
 */
const moveDirectory = (folder: folder, directoryLevel: string) => {
  //現在いるディレクトリを子往診
  currentDirectory.value = folder;

  //ディレクトリーツリーの深さ取得
  const lengthOfDirectoryTree = Object.keys(directoryTree.value).length;
  //ディレクトリーツリーから移動先の深さより下のものを削除
  for (
    let i = Number.parseInt(directoryLevel) + 1;
    i <= lengthOfDirectoryTree;
    i++
  ) {
    delete directoryTree.value[i];
  }

  //ファイルとフォルダを再取得
  fetchFilesAndFolders();
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
 * 選択したファイルをInputへ適用
 */
const finalizeSelectedFile = () => {
  const fileSelectedResult: inputFileSelected[] = [];

  //選択したファイルを親のInputで扱える形にする
  for (const file of fileSelected.value) {
    //伝送するデータを整備
    fileSelectedResult.push({
      fileId: file.id,
      fileBuffer: null,
      fileInfo: toRaw(file),
      uploadedFrom: "remote",
      ready: true,
    });
  }

  //親コンポのInputへ渡す
  emits("applySelectedFile", fileSelectedResult);
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
  }
};

/**
 * フォルダ構成の受け取り
 * @param dat
 */
const SOCKETfetchFolders = (dat: { result: string; data: folder[] }) => {
  console.log("RemoteFileSelect :: dat->", dat);
  if (dat.result === "SUCCESS") {
    folderIndex.value = dat.data;
    //ディレクトリーツリーの長さ取得
    const lengthOfDirectoryTree = Object.keys(directoryTree.value).length;
    //その長さの数に代入する
    directoryTree.value[lengthOfDirectoryTree.toString()] = dat.data;
  }
};

onMounted(() => {
  socket.on("RESULT::fetchFileIndex", SOCKETfetchFileIndex);
  socket.on("RESULT::fetchFolders", SOCKETfetchFolders);

  //ファイルインデックスを取得
  fetchFilesAndFolders();
});

onUnmounted(() => {
  socket.off("RESULT::fetchFileIndex", SOCKETfetchFileIndex);
  socket.off("RESULT::fetchFolders", SOCKETfetchFolders);
});
</script>

<template>
  <m-card class="d-flex flex-col" width="100%" height="100%">
    <v-card-title>
      ファイルを選択
    </v-card-title>

    <v-card-text class="flex-grow-1 flex-shrink-1">
      <div class="d-flex flex-column" style="height:100%;">
        
        <m-card
          class=""
          variant="outlined"
          height="30%"
          width="100%"
        >
          <div class="d-flex flex-row overflow-x-auto" style="width:100%; height:100%;">
            <!-- ディレクトリの中身のフォルダ表示部分 -->
            <div
              v-for="directory,index in directoryTree"
              class="d-flex flex-column flex-shrink-0 mr-1 overflow-y-auto"
              style="width:25%; height:100%;"
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
                  <p class="text-truncate">{{ getChannelinfoSingle(folderInfo.id.slice(1)).channelName }}</p>
                </span>
              </m-card-compact>
            </div>
          </div>
        </m-card>
        
        <v-data-table
          v-model="fileSelected"
          class="flex-grow-1 rounded-xl mt-3"
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
      </div>

      <!-- 選択したファイルのプレビュー -->
      <div class="flex-shrink-0 mt-2 d-flex flex-wrap">
        <v-chip
          v-for="file in fileSelected"
          size="small"
          class="mr-1 mt-1"
        >
          {{ file.name }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions class="flex-shrink-0">
      <m-btn @click="finalizeSelectedFile" color="primary">選択</m-btn>
    </v-card-actions>
  </m-card>
</template>