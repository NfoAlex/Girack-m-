<script setup lang="ts">
import SwitchTheme from "~/components/file/SwitchTheme.vue";
import calcSizeInHumanFormat from "~/composables/calcSizeInHumanFormat";
import { socket } from "~/socketHandlers/socketInit";
import { useServerinfo } from "~/stores/serverinfo";
import type { file } from "~/types/file";

//タブ名にファイル名を表示する用
import { useTitle } from "@vueuse/core";
const title = useTitle();

const { getServerinfo } = storeToRefs(useServerinfo());

const route = useRoute();

definePageMeta({
  layout: "plain", //レイアウトを何もないやつに設定
});

/**
 * data
 */
const fileData = ref<file>({
  id: "",
  userId: "",
  name: "",
  isPublic: false,
  size: 0,
  type: "",
  uploadedDate: "",
  directory: "",
  isDelete: false,
});
const fileBufferData = ref<{
  blob: Blob | null;
  filename: string;
  fileURL: string;
}>({
  blob: null,
  filename: "",
  fileURL: "",
});
const fetchResult = ref<
  "" | "SUCCESS" | "ERROR_FILE_MISSING" | "ERROR_FILE_IS_PRIVATE"
>("");
const downloadStatus = ref<"" | "DOWNLOADING" | "SUCCESS" | "FAILED">(""); //ダウンロード結果
const imagePreviewUrl = ref<string>("");

/**
 * ダウンロード!
 */
const download = async () => {
  try {
    const link = document.createElement("a");

    link.href = `/downloadfile/${fileData.value.id}`;
    link.download = fileData.value.name;
    link.style.display = "none";

    console.log("/file :: download : fileData.value->", fileData.value);

    document.body.appendChild(link);
    link.click();

    // Clean up
    window.URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  } catch (error) {
    console.error("/file :: エラー->", error);
    downloadStatus.value = "FAILED";
  }
};

/**
 * ファイル情報受け取り
 * @param dat
 */
const SOCKETfetchFileInfo = (dat: {
  result: "" | "SUCCESS" | "ERROR_FILE_MISSING" | "ERROR_FILE_IS_PRIVATE";
  data: {
    fileId: string;
    fileInfo: file;
  };
}) => {
  console.log("SOCKETfetchFileInfo :: dat->", dat);

  //成功ならデータを格納
  if (dat.result === "SUCCESS") {
    fileData.value = dat.data.fileInfo;
    fetchResult.value = dat.result;

    //タブ名にファイル名設定
    title.value = `${getServerinfo.value.servername} : ${fileData.value.name}`;

    //prepareFile();
  } else {
    fetchResult.value = dat.result;
  }
};

onMounted(() => {
  console.log("/file :: route->", route.params.id);

  socket.on("RESULT::fetchFileInfo", SOCKETfetchFileInfo);

  //タブ名に初期表示用にインスタンス名を表示
  title.value = `${getServerinfo.value.servername} : ファイル`;

  //送信者情報格納用
  let RequestSenderLoaded = { userId: "", sessionId: "" };

  //クッキーからセッションデータを取得、格納
  const tempCookieUserId = useCookie("userId").value?.toString();
  const tempCookieSessionId = useCookie("sessionId").value?.toString();
  //クッキーの値が有効なら格納、VueUseのアレでエラーが出るが値はJSONで帰ってくる
  if (tempCookieUserId !== undefined && tempCookieSessionId !== undefined) {
    //送信者情報を格納
    RequestSenderLoaded = {
      userId: tempCookieUserId,
      sessionId: tempCookieSessionId,
    };
    //ファイル情報取得
    socket.emit("fetchFileInfo", {
      RequestSender: RequestSenderLoaded,
      fileId: route.params.id,
    });
  } else {
    //ファイル情報取得
    socket.emit("fetchFileInfo", {
      fileId: route.params.id,
    });
  }
});

onUnmounted(() => {
  socket.off(
    `RESULT :: fetchFileInfo : ${route.params.id} `,
    SOCKETfetchFileInfo,
  );

  //プレビュー用の画像URLを無効化
  if (imagePreviewUrl.value !== "") {
    //URL.revokeObjectURL(imagePreviewUrl.value);
    URL.revokeObjectURL(fileBufferData.value.fileURL);
  }
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
      >
        <!-- 画像ファイルだった時のプレビュー表示 -->
        <div v-if="fileData.type.startsWith('image/') || undefined">
          <img :src="'/downloadfile/' + route.params.id" width="100%" />
          <v-divider class="my-2" />
        </div>
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

        <m-btn
          @click="download"
          :loading="downloadStatus==='DOWNLOADING'"
          :disabled="downloadStatus==='SUCCESS'"
          color="primary"
          block
          class="mt-3 d-flex align-center"
        >
          <v-icon>mdi-download</v-icon>
          <p v-if="downloadStatus==='SUCCESS'">完了</p>
          <p v-else>ダウンロード</p>
        </m-btn>
        <p
          v-if="downloadStatus==='FAILED'"
          class="text-center mt-1 text-subtitle-2"
        >ダウンロードに失敗しました...</p>
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
      <m-card color="messageHovered" class="mx-auto d-flex align-center" maxWidth="100%">
        <p class="text-h6 mr-5 text-truncate">{{ getServerinfo.servername }}</p>
        <!-- テーマ切り替えようボタン -->
        <SwitchTheme class="ml-auto" />
      </m-card>

    </v-container>

  </div>
</template>