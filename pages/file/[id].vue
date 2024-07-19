<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import calcSizeInHumanFormat from "~/composables/calcSizeInHumanFormat";
import SwitchTheme from '~/components/file/SwitchTheme.vue';
import { useServerinfo } from '~/stores/serverinfo';
import type { file } from '~/types/file';

const { getServerinfo } = storeToRefs(useServerinfo());

const route = useRoute();

definePageMeta({
  layout: "plain", //レイアウトを何もないやつに設定
});

/**
 * data
 */
const fileIsPublic = ref<boolean>(false);
const fileData = ref<file>({
  id: '',
  userId: '',
  name: '',
  isPublic: false,
  size: 0,
  uploadedDate: ''
});
const fetchResult = ref<""|"SUCCESS"|"ERROR_FILE_MISSING"|"ERROR_FILE_IS_PRIVATE">("")

/**
 * ダウンロード!
 */
const download = async () => {
  try {
    const formData = new FormData();

    //クッキーからセッションデータを取得、格納
    const cookieLoaded = useCookie("session").value;
    let RequestSenderLoaded = {userId:"", sessionId:""};
    //クッキーの値が有効なら格納、VueUseのアレでエラーが出るが値はJSONで帰ってくる
    if (cookieLoaded !== undefined) {
      //送信者情報を格納
      RequestSenderLoaded = {
        userId: cookieLoaded.userId,
        sessionId: cookieLoaded.sessionId
      }
    }

    // JSONデータを文字列に変換して追加
    formData.append(
      'metadata',
      JSON.stringify(
        {
          RequestSender: {
            userId: RequestSenderLoaded.userId,
            sessionId: RequestSenderLoaded.sessionId
          }
        }
      )
    );

    console.log("formData->", formData);

    const response = await fetch('/downloadfile/' + route.params.id, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

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

    const link = document.createElement('a');

    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
}

/**
 * ファイル情報受け取り
 * @param dat 
 */
const SOCKETfetchFileInfo = (
  dat: {
    result: ""|"SUCCESS"|"ERROR_FILE_MISSING"|"ERROR_FILE_IS_PRIVATE",
    data: file
  }
) => {
  console.log("/file :: dat->", dat);
  fetchResult.value = dat.result;

  //成功ならデータを格納
  if (dat.result === "SUCCESS") {
    fileData.value = dat.data;
  }
}

onMounted(() => {
  console.log("/file :: route->", route.params.id);

  socket.on("RESULT::fetchFileInfo:" + route.params.id, SOCKETfetchFileInfo);

  //送信者情報格納用
  let RequestSenderLoaded = {userId:"", sessionId:""};

  //クッキーからセッションデータを取得、格納
  const cookieLoaded = useCookie("session").value;
  //クッキーの値が有効なら格納、VueUseのアレでエラーが出るが値はJSONで帰ってくる
  if (cookieLoaded !== undefined) {
    //送信者情報を格納
    RequestSenderLoaded = {
      userId: cookieLoaded.userId,
      sessionId: cookieLoaded.sessionId
    }
    //ファイル情報取得
    socket.emit("fetchFileInfo", {
      RequestSender: RequestSenderLoaded,
      fileId: route.params.id
    });
  } else {
    //ファイル情報取得
    socket.emit("fetchFileInfo", {
      fileId: route.params.id
    });
  }
});

onUnmounted(() => {
  socket.off("RESULT::fetchFileInfo:" + route.params.id, SOCKETfetchFileInfo);
});
</script>

<template>
  <div style="width:100vw; height:100vh;" class="d-flex flex-column py-5">

    <v-container
      class="flex-grow-1 d-flex flex-column align-center justify-center"
      style="max-width:500px; height:100vh;"
    >

      <!-- ロード中表示 -->
      <m-card
        v-if="fetchResult === ''"
        style="width:100%;"
        loading
      >
        <p class="text-center text-disabled">ファイル取得中...</p>
      </m-card>

      <!-- ファイル情報表示 -->
      <m-card
        v-if="fetchResult === 'SUCCESS'"
        class="my-auto my-3"
        color="messageHovered"
        style="width:100%;"
      >
        <p class="text-h5 text-center mb-3">{{ fileData.name }}</p>
        <span class="d-flex justify-space-evenly align-center">
          <span class="d-flex align-center">
            <p class="mr-1 text-disabled">サイズ :  </p>
            <v-chip>{{ calcSizeInHumanFormat(fileData.size) }}</v-chip>
          </span>
          <v-icon color="gray">mdi-circle-small</v-icon>
          <span class="d-flex align-center">
            <p class="mr-1 text-disabled">日時 :  </p>
            <v-chip>{{ new Date(fileData.uploadedDate).toLocaleString() }}</v-chip>
          </span>
        </span>
        <m-btn @click="download" block color="primary" class="mt-3 d-flex align-center">
          <v-icon>mdi-download</v-icon>
          <p>ダウンロード</p>
        </m-btn>
      </m-card>

      <!-- エラー表示用 -->
      <m-card
        v-if="fetchResult!=='SUCCESS' && fetchResult!==''"
        class="text-center my-auto"
        color="messageHovered"
      >
        <p>エラー :: {{ fetchResult }}</p>
      </m-card>

      <!-- フッター -->
      <m-card color="messageHovered" class="mx-auto d-flex align-center" style="width:500px;">
        <p class="text-h6">{{ getServerinfo.servername }}</p>
        <!-- テーマ切り替えようボタン -->
        <SwitchTheme class="ml-auto" />
      </m-card>

    </v-container>

  </div>
</template>