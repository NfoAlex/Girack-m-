<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

import type { folder } from "~/types/file";

const props = defineProps<{
  currentDirectory: folder;
}>();

const emits = defineEmits<(e: "closeDialog") => void>();

/**
 * data
 */
const statusUpload = ref<"WAITING" | "UPLOADING" | "DONE">("WAITING");
const fileItems = ref<File[]>([]);
const fileUploadStatus = ref<
  {
    progress: number;
    status: "DONE" | "FAILED" | "UPLOADING" | "WAITING";
  }[]
>([]);
const elFileInput = ref(null); //入力欄要素を取得するためのref

/**
 * ファイルの入力を受け取る
 */
const fileInput = () => {
  if (elFileInput.value === null) return;

  //ファイルデータを初期化
  fileItems.value = [];

  //inputに入力されたファイルの数ぶん処理する
  for (const index in elFileInput.value.files) {
    //条件を調べる
    if (
      elFileInput.value.files[index].size < 1 ||
      elFileInput.value.files[index].size === undefined
    ) {
      console.log("filePortal :: fileInput : ファイル入力エラー");
    } else {
      //ファイルアップロード状況配列へ初期の値を挿入
      fileUploadStatus.value.push({
        progress: 0,
        status: "WAITING",
      });
      //ファイルデータ用配列へファイルデータを追加
      fileItems.value.push(elFileInput.value.files[index]);
      //console.log("filePortal :: fileInput : fileItems->", fileItems.value);
    }
  }
};

/**
 * 入力したファイルを削除
 * @param index
 */
const trimFileItem = (index: number) => {
  fileItems.value.splice(index, 1);
};

/**
 * ファイルをアップロードする
 */
const uploadFiles = async () => {
  //アップロード中と設定
  statusUpload.value = "UPLOADING";

  //送信者情報
  const metadataForForm = {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    directory: props.currentDirectory.id,
  };

  //ファイル数
  const fileNum = fileItems.value.length;
  //完了したファイル数
  let fileUploadedNum = 0;

  for (const fileIndex in fileItems.value) {
    //アップロードするデータフォームオブジェクト生成
    const formData = new FormData();
    //送信者情報とディレクトリを付与
    formData.append("metadata", JSON.stringify(metadataForForm));
    //ファイルそのものを内包
    formData.append("file", fileItems.value[fileIndex]);

    //アップロード用のXHRインスタンス
    const xhr = new XMLHttpRequest();
    //アップロード状況追跡用
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        //アップロード状況を更新する
        fileUploadStatus.value[fileIndex].progress = Math.round(
          (event.loaded / event.total) * 100,
        );

        //もし進捗状況が100なら完了したファイル数を加算、同時に全部確認
        if (Math.round((event.loaded / event.total) * 100) === 100) {
          fileUploadedNum++;
          //もし完了した数とファイル数が同じなら完了したと設定
          if (fileUploadedNum === fileNum) {
            statusUpload.value = "DONE";
          }
        }
      }
    });

    //アップロードの結果表示用
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        //console.log('UploadFiles :: 成功!->', xhr.responseText);
        //ファイルインデックスを取り直す
        socket.emit("fetchFileIndex", {
          RequestSender: {
            userId: getMyUserinfo.value.userId,
            sessionId: getSessionId.value,
          },
          directory: props.currentDirectory.id,
        });
        //結果を格納
        fileUploadStatus.value[fileIndex].status = "DONE";
      } else {
        console.error("UploadFiles :: 失敗...->", xhr.statusText);
        //エラーを格納
        fileUploadStatus.value[fileIndex].status = "FAILED";
      }
    });

    //アップロード先のURLを指定
    xhr.open("POST", "/uploadfile");
    //アップロード中と設定
    fileUploadStatus.value[fileIndex].status = "UPLOADING";
    //アップロードする
    xhr.send(formData);
  }
};

/**
 * ファイル入力ボタンを仮想的にクリックするだけ
 */
const clickUploadButton = () => {
  document.getElementById("elFileInput")?.click();
};

onMounted(() => {
  if (elFileInput !== null) {
    clickUploadButton();
  }
});
</script>

<template>
  <m-card style="overflow-y: auto">
    <v-card-title class="d-flex align-center">
      <p class="mr-2">ファイルアップロード</p>
      <p
        v-if="props.currentDirectory.id!==''"
        class="text-disabled text-center text-subtitle-2 ml-auto mr-1"
      >
        場所 :  
      </p>
      <v-chip v-if="props.currentDirectory.id!==''">{{ props.currentDirectory.name }}</v-chip>
    </v-card-title>

    <v-card-text>

      <!-- ファイル選択させる -->
      <m-btn @click="clickUploadButton" block variant="text">
        <v-icon>mdi-plus</v-icon>
      </m-btn>

      <!-- ファイル情報の表示 -->
      <m-card
        v-for="file,index of fileItems"
        color="cardInner"
        class="mb-2"
      >
        <span class="d-flex align-center">
          <p class="my-1">{{ file.name }}</p>
          <span class="ml-auto">
            <m-btn
              v-if="fileUploadStatus[index].status=='WAITING'"
              @click="trimFileItem(index)"
              size="x-small"
              icon="mdi-delete"
              color="red"
              variant="outlined"
            >
            </m-btn>
            <v-progress-circular
              v-if="fileUploadStatus[index].status==='UPLOADING'"
              :width="3"
              size="24"
              indeterminate
            />
            <v-icon
              v-if="fileUploadStatus[index].status==='DONE'"
              color="success"
            >mdi-check</v-icon>
            <v-icon
              v-if="fileUploadStatus[index].status==='FAILED'"
              color="error"
            >mdi-alert-circle-outline</v-icon>
          </span>
        </span>
        <span>
          <v-progress-linear :model-value="fileUploadStatus[index].progress" rounded class="mt-2" />
        </span>
      </m-card>

    </v-card-text>

    <v-card-actions>
      <m-btn
        v-if="statusUpload !== 'DONE'"
        @click="uploadFiles"
        color="primary"
        :disabled="statusUpload==='UPLOADING'"
        :loading="statusUpload==='UPLOADING'"
      >
        アップロードする
      </m-btn>

      <m-btn
        v-if="statusUpload === 'DONE'"
        @click="emits('closeDialog')"
      >
        閉じる
      </m-btn>
    </v-card-actions>
  </m-card>

  <!-- ファイル受け取り部分(非表示) -->
  <input
    @change="fileInput"
    type="file"
    id="elFileInput"
    ref="elFileInput"
    style="display: none"
    multiple
  />
</template>