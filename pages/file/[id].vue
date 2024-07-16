<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
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

  socket.on("RESULT::fetchFileInfo", SOCKETfetchFileInfo);

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
  }

  socket.emit("fetchFileInfo", {
    RequestSender: RequestSenderLoaded,
    fileId: route.params.id
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchFileInfo", SOCKETfetchFileInfo);
});
</script>

<template>
  <div style="width:100vw; height:100vh;" class="d-flex flex-column py-5">

    <v-container
      class="flex-grow-1 d-flex flex-column align-center justify-center"
      style="max-width:500px; height:100vh;"
    >

      <m-card
        v-if="fetchResult === ''"
        style="width:100%;"
        loading
      >
        <p class="text-center text-disabled">ファイル取得中...</p>
      </m-card>

      <m-card
        v-if="fetchResult === 'SUCCESS'"
        class="my-auto my-3"
        color="messageHovered"
        style="width:100%;"
      >
        <p class="text-h5 text-center mb-3">{{ fileData.name }}</p>
        <span class="d-flex justify-space-evenly align-center">
          <v-chip>{{ fileData.size }}</v-chip>
          <v-icon color="gray">mdi-circle-small</v-icon>
          <span class="d-flex align-center">
            <p class="mr-1">日時 :  </p>
            <v-chip>{{ new Date(fileData.uploadedDate).toLocaleString() }}</v-chip>
          </span>
        </span>
        <m-btn block color="primary" class="mt-3 d-flex align-center">
          <v-icon>mdi-download</v-icon>
          <p>ダウンロード</p>
        </m-btn>
      </m-card>

      <m-card v-if="fetchResult!=='SUCCESS' && fetchResult!==''" class="text-center" color="messageHovered">
        <p>エラー :: {{ fetchResult }}</p>
      </m-card>

    </v-container>

    <m-card color="messageHovered" class="mx-auto d-flex">
      <p>{{ getServerinfo.servername }}</p>
    </m-card>

  </div>
</template>