<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import calcSizeInHumanFormat from '~/composables/calcSizeInHumanFormat';
import { getBlobUrl, registerBlobUrl } from '~/composables/manageBlobUrl';
import { useMyUserinfo } from '~/stores/userinfo';
import type { file } from '~/types/file';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

const propsMessage = defineProps<{
  fileId: string[]
}>();

/**
 * data
 */
const fileInfo = ref<file[]>([]);
const fileBlobArr = ref<
  {
    [key: string]: {
      fileName: string,
      blobUrl: string|null
    }
  }
>({});

/**
 * ファイルダウンロード用のURLを生成する
 */
const prepareFile = async (fileId:string) => {
  if (getBlobUrl(fileId) !== undefined) return;

  const formData = new FormData();

  // JSONデータを文字列に変換して追加
  formData.append(
    'metadata',
    JSON.stringify(
      {
        RequestSender: {
          userId: getMyUserinfo.value.userId,
          sessionId: getSessionId.value
        }
      }
    )
  );

  //ファイル取得
  const response = await fetch('/downloadfile/' + fileId, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) return;

  // Content-Dispositionヘッダーからファイル名を取得
  const contentDisposition = response.headers.get('Content-Disposition');
  let fileName = 'download'; // デフォルトのファイル名
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
    if (fileNameMatch) {
      fileName = fileNameMatch[1];
    }
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  //blobキャッシュへ保存
  registerBlobUrl(fileId, {fileName:fileName, blobUrl:url});

  //ファイルデータ用JSONへ格納
  fileBlobArr.value[fileId] = {
    fileName: fileName,
    blobUrl: url
  };
}

/**
 * ファイルをダウンロードする
 * @param fileId 
 */
const downloadFile = (fileId:string) => {
  //仮想ボタン用のアンカーオブジェクト
  const link = document.createElement('a');

  if (
    fileBlobArr.value[fileId] !== undefined
  ) {
    if (fileBlobArr.value[fileId].blobUrl !== null) {

      //ダウンロードするための仮想ボタン作成(見えない)
      link.href = fileBlobArr.value[fileId].blobUrl;
      link.download = fileBlobArr.value[fileId].fileName;
      link.style.display = 'none';

      //blobUrl = fileBlobArr.value[fileId].blobUrl
    }
  }
  
  const blobData = getBlobUrl(fileId);
  if (blobData !== undefined) {

    //ダウンロードするための仮想ボタン作成(見えない)
    link.href = blobData.blobUrl;
    link.download = blobData.fileName;
    link.style.display = 'none';
  }

  if (link.href === "") return;

  //ブラウザにダウンロードさせる
  document.body.appendChild(link);
  link.click();

  //掃除
  document.body.removeChild(link);
}

/**
 * 画像用のblobUrl取得
 * @param fileId 
 */
const getImageUrl = (fileId:string) => {
  //キャッシュにあるか確認して取得
  const blobCacheUrl = getBlobUrl(fileId)?.blobUrl;
  if (blobCacheUrl !== undefined) {
    console.log("FileDataPreview :: キャッシュから");
    return blobCacheUrl;
  }

  //今取得したものであるか確認して取得
  if (fileBlobArr.value[fileId] !== undefined) {
    return fileBlobArr.value[fileId].blobUrl;
  }

  return "";
}

/**
 * ファイル情報受け取り
 */
const SOCKETfetchFileInfo = (dat:{result:string, data:file}) => {
  //console.log("FileDataPreview :: dat->", dat);

  if (dat.result === "SUCCESS") {
    //ファイル情報格納
    fileInfo.value.push(dat.data);
    //ファイルダウンロードのblob生成
    prepareFile(dat.data.id);
  } else if (dat.result === "ERROR_FILE_MISSING") {
    //データ取得ができなくても削除されたファイルとして登録する
    fileInfo.value.push({
      id: 'ERROR_FILE_MISSING',
      userId: '',
      name: '',
      isPublic: false,
      size: 0,
      type: '',
      uploadedDate: '',
    });
  }
}

onMounted(() => {
  nextTick(() => {
    for (let index in propsMessage.fileId) {
      //console.log("FIleDataPreview :: fileId->", propsMessage.fileId[index]);

      //ファイル情報受け取り用
      socket.on("RESULT::fetchFileInfo:" + propsMessage.fileId[index], SOCKETfetchFileInfo);

      //ファイル情報を取得
      socket.emit("fetchFileInfo", {
        RequestSender: {
          userId: getMyUserinfo.value.userId,
          sessionId: getSessionId.value
        },
        fileId: propsMessage.fileId[index]
      });
    }
  });
});

onUnmounted(() => {
  for (let fileId of propsMessage.fileId) {
    socket.off("RESULT::fetchFileInfo:" + fileId, SOCKETfetchFileInfo);
  }
});
</script>

<template>
  <span v-for="file in fileInfo" style="width:100%">
    <m-card
      color="cardInner"
      class="mt-1 d-flex flex-column"
    >

      <!-- プレビュー用画像表示 -->
      <v-img
        v-if="getImageUrl(file.id)"
        :src="getImageUrl(file.id)"
        class="rounded-lg"
        maxHeight="150px"
      />

      <span class="mt-1 d-flex align-center" style="max-height:150px;">
        <v-icon
          v-if="file.id !== 'ERROR_FILE_MISSING'"
          class="mr-1"
        >mdi-folder</v-icon>
        <v-icon
          v-else
          class="mr-1"
        >mdi-delete</v-icon>

        <a
          v-if="file.id !== 'ERROR_FILE_MISSING'"
          :href="'/file/' + file.id"
          rel="noopener noreferrer" target="_blank"
          class="text-truncate flex-shrink-1"
        >
          {{ file.name }}
        </a>
        <p v-if="file.id === 'ERROR_FILE_MISSING'" class="text-disabled">このファイルは削除されています。</p>

        <m-btn
          @click="downloadFile(file.id)"
          icon="mdi-download"
          variant="text"
          size="small"
          class="ml-auto"
        />

        <v-chip size="small" class="flex-shrink-0">{{ calcSizeInHumanFormat(file.size) }}</v-chip>
      </span>
    </m-card>
  </span>
</template>