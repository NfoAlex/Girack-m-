<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

import type { file } from '~/types/file';

/**
 * data
 */

const fileItems = ref<File[]>([]);
const fileUploadStatus = ref<number[]>([]);
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
      //ファイルアップロード状況配列へ初期数値0を挿入
      fileUploadStatus.value.push(0);
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
        fileUploadStatus.value[fileIndex] = Math.round((event.loaded / event.total) * 100);
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
      } else {
        console.error('UploadFiles :: 失敗...->', xhr.statusText);
      }
    });

    //アップロード先のURLを指定
    xhr.open('POST', '/uploadfile');
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
      ファイルをアップロードします

      <m-card
        v-for="file,index of fileItems"
        color="cardInner"
        class="mb-2"
      >
        <span class="d-flex align-center">
          <p class="my-1">{{ file.name }}</p>
          <m-btn
            @click="trimFileItem(index)"
            class="ml-auto"
            size="x-small"
            icon="mdi-delete"
            color="red"
            variant="outlined"
          >
          </m-btn>
        </span>
        <span>
          <v-progress-linear :model-value="fileUploadStatus[index]" rounded class="mt-2" />
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