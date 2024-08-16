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
const fileBlob = ref<Blob|null>(null);

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

  fileBlob.value = blob;
};

/**
 * 画像用のblobUrl取得
 * @param fileId
 */
const getImageUrl = (fileId: string): string => {
  //キャッシュにあるか確認して取得
  const blobCacheUrl = getBlobUrl(fileId)?.blobUrl;
  const blobStatus = getBlobUrl(fileId)?.status;
  if (blobCacheUrl !== undefined && blobStatus === "DONE") {
    /*
    console.log(
      "ImagePreview :: getImageUrl : imageUrls->",
      imageUrls.value,
    );
    */

    return blobCacheUrl;
  }

  if (blobStatus !== "FAILED" && blobStatus !== "FETCHING") {
    prepareFile(fileId);
    return "/loading.svg";
  }

  return "/loading.svg";
};

onBeforeMount(() => {
  //BlobURLを生成する
  prepareFile(props.fileId);
});
</script>

<template>
  <div>
    プレビュー
  </div>
</template>