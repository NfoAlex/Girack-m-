<script setup lang="ts">
import { useMyUserinfo } from "~/stores/userinfo";
import { getBlobUrl, registerBlobUrl } from "~/composables/manageBlobUrl";
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

const props = defineProps<{
  fileId: string;
}>();

/**
 * data
 */
const imageUrl = ref<string>("/loading.svg");
const tryCount = ref<number>(0);

/**
 * ファイルダウンロード用のURLを生成する
 * @param fileId プレビューしたい画像のファイルId
 */
const prepareFile = async (fileId: string) => {
  if (getBlobUrl(fileId) !== undefined) return;

  //取得中と登録
  registerBlobUrl(fileId, {
    fileName: "",
    status: "FETCHING",
    blobUrl: "/loading.svg",
  });

  //console.log("FileDataPreview :: prepareFile : 準備します->", fileId);

  const formData = new FormData();

  // JSONデータを文字列に変換して追加
  formData.append(
    "metadata",
    JSON.stringify({
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value,
      },
    }),
  );

  //ファイル取得
  const response = await fetch(`/downloadfile/${fileId}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    //blobキャッシュへ保存
    registerBlobUrl(fileId, { fileName: "", status: "FAILED", blobUrl: "" });
    return;
  }

  // Content-Dispositionヘッダーからファイル名を取得
  const contentDisposition = response.headers.get("Content-Disposition");
  let fileName = "download"; // デフォルトのファイル名
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
    if (fileNameMatch) {
      fileName = fileNameMatch[1];
    }
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  //blobキャッシュへ保存
  registerBlobUrl(fileId, { fileName: fileName, status: "DONE", blobUrl: url });

  imageUrl.value = url;
};

/**
 * 画像用のblobUrl取得
 * @param fileId
 */
const getImageUrl = (fileId: string): void => {
  //キャッシュにあるか確認して取得
  const blobCacheUrl = getBlobUrl(fileId)?.blobUrl;
  const blobStatus = getBlobUrl(fileId)?.status;
  if (blobCacheUrl !== undefined && blobStatus === "DONE") {
    imageUrl.value = blobCacheUrl;
    return;
  }

  if (blobStatus !== "FAILED" && blobStatus !== "FETCHING") {
    if (tryCount.value <= 5) {
      console.log("tryします");
      setTimeout(()=>prepareFile(fileId), 2000);
      tryCount.value++;
    }
    imageUrl.value = "/loading.svg";
    return;
  }

  imageUrl.value = "/loading.svg";
};

onBeforeMount(() => {
  //BlobURLを生成する
  prepareFile(props.fileId);

  nextTick(() => getImageUrl(props.fileId));
});
</script>

<template>
  <div>
    <NuxtImg
      :src="imageUrl"
      quality="75"
      class="rounded-lg py-1 px-1"
      style="max-width:64px; max-height:64px;"
      loading="lazy"
    />
  </div>
</template>