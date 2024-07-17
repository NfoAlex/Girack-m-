<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

import type { file } from '~/types/file';

/**
 * data
 */

const fileItems = ref<File[]>([]);
const fileUploadStatus = ref<
  {
    progress: number,
    status: "DONE"|"FAILED"|"UPLOADING"|"WAITING"
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

  console.log("filePortal :: fileInput : ファイルデータ->",
    elFileInput.value.files[0].size < 1,
    elFileInput.value.files[0].size === undefined
  );

  //inputに入力されたファイルの数ぶん処理する
  for (let index in elFileInput.value.files) {
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
        status: 'WAITING'
      });
      //ファイルデータ用配列へファイルデータを追加
      fileItems.value.push(elFileInput.value.files[index]);
      console.log("filePortal :: fileInput : fileItems->", fileItems.value);
    }
  }
}

/**
 * 入力したファイルを削除
 * @param index 
 */
const trimFileItem = (index:number) => {
  fileItems.value.splice(index,1);
}

/**
 * ファイルをアップロードする
 */
const uploadFiles = async () => {
  //送信者情報の文字列化したもの
  const RequestSenderInString = JSON.stringify({
    userId: getMyUserinfo.value.userId,
    sessionId: getSessionId.value
  });

  for (let fileIndex in fileItems.value) {
    //アップロードするデータフォームオブジェクト生成
    const formData = new FormData();
    //送信者情報を付与
    formData.append('metadata', RequestSenderInString);
    //ファイルそのものを内包
    formData.append('file', fileItems.value[fileIndex]);

    //アップロード用のXHRインスタンス
    const xhr = new XMLHttpRequest();
    //アップロード状況追跡用
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        console.log(
          "UploadFiles :: アップロード状況->",
          Math.round((event.loaded / event.total) * 100)
        );
        //アップロード状況を更新する
        fileUploadStatus.value[fileIndex].progress = Math.round((event.loaded / event.total) * 100);
      }
    });

    //アップロードの結果表示用
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log('UploadFiles :: 成功!->', xhr.responseText);
        //ファイルインデックスを取り直す
        socket.emit("fetchFileIndex", {
          RequestSender: {
            userId: getMyUserinfo.value.userId,
            sessionId: getSessionId.value
          }
        });
        //結果を格納
        fileUploadStatus.value[fileIndex].status = "DONE";
      } else {
        console.error('UploadFiles :: 失敗...->', xhr.statusText);
        //エラーを格納
        fileUploadStatus.value[fileIndex].status = "FAILED";
      }
    });

    //アップロード先のURLを指定
    xhr.open('POST', '/uploadfile');
    //アップロード中と設定
    fileUploadStatus.value[fileIndex].status = "UPLOADING";
    //アップロードする
    xhr.send(formData);
  }
}

onMounted(() => {
  if (elFileInput !== null) {
    document.getElementById("elFileInput")?.click();
  }
});
</script>

<template>
  <m-card style="overflow-y: auto">
    <v-card-title>
      ファイルアップロード
    </v-card-title>

    <v-card-text>

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
              v-if="fileUploadStatus[index].status!=='UPLOADING'"
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
        @click="uploadFiles"
        color="primary"
      >
        アップロードする
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