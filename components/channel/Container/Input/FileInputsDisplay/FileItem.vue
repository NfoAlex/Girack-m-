<script setup lang="ts">
import { useMyUserinfo } from '~/stores/userinfo';
import type { file } from '~/types/file';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

const props = defineProps<{
  fileInput: {
    fileId: string,
    fileBuffer: File|null,
    fileInfo: file|null,
    uploadedFrom: "remote"|"local"
    ready: boolean
  },
  channelId: string
}>();

const emits = defineEmits<{
  (e:"appendFileId", fileId:string):void, //指定ファイルの入力を削除
  (e:"setReady"):void,
  (  //親のファイルId配列を更新する
    e: "updateFileData",
    fileData: {
      fileId: string,
      fileBuffer: File|null,
      fileInfo: file|null,
      uploadedFrom: "remote"|"local"
      ready: boolean
    }
  ):void,
}>();

/**
 * data
 */
const progress = ref<number>(0);
const status = ref<"WAITING"|"UPLOADING"|"SUCCESS"|"FAILED">("WAITING");

/**
 * ファイルをアップロードする
 */
const uploadFile = () => {
  if (
    props.fileInput.uploadedFrom === "remote"
    ||
    props.fileInput.fileBuffer === null
  ) return;

  //埋め込むメタデータ
  const metadataForForm = {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    directory: "C" + props.channelId
  };

  //アップロードするデータフォームオブジェクト生成
  const formData = new FormData();
  //送信者情報とディレクトリを付与
  formData.append('metadata', JSON.stringify(metadataForForm));
  //ファイルそのものを内包
  formData.append('file', props.fileInput.fileBuffer);

  //アップロード用のXHRインスタンス
  const xhr = new XMLHttpRequest();
  //アップロード状況追跡用
  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      console.log(
        "FileItem :: アップロード状況->",
        Math.round((event.loaded / event.total) * 100)
      );
      //アップロード状況を更新する
      progress.value = Math.round((event.loaded / event.total) * 100);
    }
  });

  //アップロードの結果用
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      console.log('FileItem :: 成功!->', xhr.responseText);
      const result:{result:string, data:string} = JSON.parse(xhr.responseText);
      //結果を格納
      status.value = "SUCCESS";
      //結果がちゃんと取れているなら親コンポにファイルIdを渡す
      if (result.data !== undefined) {
        console.log("FileItem :: 結果->", {
          ...props.fileInput,
          ready: true,
          fileId: result.data
        });
        emits(
          "updateFileData",
          {
            ...props.fileInput,
            ready: true,
            fileId: result.data
          }
        );
      } else {
        //エラーとして設定
        status.value = "FAILED";
      }
    } else {
      console.error('FileItem :: 失敗...->', xhr.statusText);
      //エラーを格納
      status.value = "FAILED";
    }
  });

  //アップロード先のURLを指定
  xhr.open('POST', '/uploadfile');
  //アップロード中と設定
  status.value = "UPLOADING";
  //アップロードする
  xhr.send(formData);
}

onMounted(() => {
  //マウント時にそのままアップロードする
  //uploadFile();
  if (props.fileInput.uploadedFrom === "local") {
    uploadFile();
  }

  console.log("FileItem :: props.fileInput->", props.fileInput);
});
</script>

<template>
  <span class="d-flex align-center">
    <p class="flex-grow-1 mr-2">{{ props.fileInput.fileBuffer?.name }}</p>
    <v-icon
      v-if="status==='SUCCESS'"
      size="small"
      color="success"
    >mdi-check</v-icon>
    <v-icon
      v-if="status==='FAILED'"
      size="small"
      color="error"
    >mdi-alert-circle-outline</v-icon>
    <v-progress-circular
      v-if="status==='UPLOADING'"
      :model-value="progress"
      width="4"
      size="24"
    ></v-progress-circular>
  </span>
</template>