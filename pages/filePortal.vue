<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

import type { file } from '~/types/file';

/**
 * data
 */
const fileIndex = ref<file[]>([]);
const fileIdSelected =ref<string[]>([]);

const header = [
  { title: 'ファイル名', value:'name' },
  { title: 'サイズ', key:"size", value: (item: file) => convertToHumanSize(item.size) },  // サイズをMB単位で表示
  { title: 'アップロード日時', key:"uploadedDate", value: (item: file) => new Date(item.uploadedDate).toLocaleString() },  // 日付をフォーマットして表示
];

const fileItems = ref<any[]>([]);
const elFileInput = ref(null); //入力欄要素を取得するためのref
const displayUpload = ref<boolean>(false);

/**
 * ファイル容量を単位表示に
 * @param fileSize 
 */
const convertToHumanSize = (fileSize:number) => {
  let sizeCalculated = fileSize;
  let level = 0;
  let sizeDisplay = ['B', 'KB', 'MB', 'GB', 'TB']

  while (sizeCalculated > 1024) {
    sizeCalculated = sizeCalculated / 1024;
    level++;
  }
  
  return Math.floor(sizeCalculated) + sizeDisplay[level];
}

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
      //ファイルデータ用配列へファイルデータを追加
      fileItems.value.push(elFileInput.value.files[index]);
      console.log("filePortal :: fileInput : fileItems->", fileItems.value);
    }
  }

  displayUpload.value = true;
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

    //ファイルをアップロード(結果はHTTPリスポンス)
    const result:Response|void = await fetch('/uploadfile', {
      method: 'POST',
      body: formData
    }).finally(() => {
      console.log("filePortal :: uploadFiles(/uploadfile) : アップロード終わり");
    }).catch((err:Error) => {
      console.log("filePortal :: uploadFiles(/uploadfile) : アップロードエラー->", err);
    });
    console.log("filePortal :: uploadFiles(/uploadfile) : result->", result);
  }

  //ファイルインデックスを取り直す
  socket.emit("fetchFileIndex", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
}

/**
 * アップロード画面を呼び出し
 */
const clickUpload = () => {
  if (elFileInput !== null) {
    document.getElementById("elFileInput")?.click();
  }
}

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
  socket.on("RESULT::deleteFile", SOCKETdeleteFile);

  //ファイルインデックスを取得
  socket.emit("fetchFileIndex", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchFileIndex", SOCKETfetchFileIndex);
  socket.off("RESULT::deleteFile", SOCKETdeleteFile);
});

</script>

<template>
  <!-- ファイルアップロード用 -->
  <v-dialog
    v-model="displayUpload"
    style="max-width: 750px; width: 85vw"
  >
    <m-card>
      <v-card-title>
        ファイルアップロード
      </v-card-title>
      <v-card-text>
        ファイルをアップロードします
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
  </v-dialog>

  <div class="pt-5 px-5 d-flex flex-column" style="height:100%;">
    <span class="d-flex align-center">
      <p
        class="text-h5"
        style="font-weight:700;"
      >ファイルポータル</p>
    </span>
    <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />

    <m-card class="mt-3">
      <div class="my-2 d-flex align-center">
        <v-icon>mdi-plus</v-icon>
        asdf
        <m-btn @click="deleteSelectedFile" class="mx-2">削除する</m-btn>
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

  <!-- ファイル受け取り部分(非表示) -->
  <input
    @change="fileInput"
    type="file"
    id="elFileInput"
    ref="elFileInput"
    style="display: none"
    multiple
  />

  <!-- アップロードボタン -->
  <v-btn
    @click="clickUpload"
    position="absolute"
    style="right:5%; bottom: 5%;"
    color="primary"
    icon="mdi:mdi-plus"
    size="x-large"
    rounded="lg"
  />
</template>