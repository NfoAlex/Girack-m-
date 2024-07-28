<script setup lang="ts">
import { useMyUserinfo } from "~/stores/userinfo";
import type { file } from "~/types/file";
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

const props = defineProps<{
	fileInput: {
		fileId: string;
		fileBuffer: File | null;
		fileInfo: file | null;
		uploadedFrom: "remote" | "local";
		ready: boolean;
	};
	channelId: string;
}>();

const emits =
	defineEmits<
		(
			//親のファイルId配列を更新する
			e: "updateFileData",
			fileData: {
				fileId: string;
				fileBuffer: File | null;
				fileInfo: file | null;
				uploadedFrom: "remote" | "local";
				ready: boolean;
			},
		) => void
	>();

/**
 * data
 */
const progress = ref<number>(0);
const status = ref<"WAITING" | "UPLOADING" | "SUCCESS" | "FAILED">("WAITING");

/**
 * ファイルをアップロードする
 */
const uploadFile = () => {
	if (
		props.fileInput.uploadedFrom === "remote" ||
		props.fileInput.fileBuffer === null
	)
		return;

	//埋め込むメタデータ
	const metadataForForm = {
		RequestSender: {
			userId: getMyUserinfo.value.userId,
			sessionId: getSessionId.value,
		},
		directory: "C" + props.channelId,
	};

	//アップロードするデータフォームオブジェクト生成
	const formData = new FormData();
	//送信者情報とディレクトリを付与
	formData.append("metadata", JSON.stringify(metadataForForm));
	//ファイルそのものを内包
	formData.append("file", props.fileInput.fileBuffer);

	//アップロード用のXHRインスタンス
	const xhr = new XMLHttpRequest();
	//アップロード状況追跡用
	xhr.upload.addEventListener("progress", (event) => {
		if (event.lengthComputable) {
			//アップロード状況を更新する
			progress.value = Math.round((event.loaded / event.total) * 100);
		}
	});

	//アップロードの結果用
	xhr.addEventListener("load", () => {
		if (xhr.status === 200) {
			console.log("FileItem :: 成功!->", xhr.responseText);
			const result: { result: string; data: string } = JSON.parse(
				xhr.responseText,
			);
			//結果を格納
			status.value = "SUCCESS";
			//結果がちゃんと取れているなら親コンポにファイルIdを渡す
			if (result.data !== undefined) {
				emits("updateFileData", {
					...props.fileInput,
					ready: true,
					fileId: result.data,
				});
			} else {
				//エラーとして設定
				status.value = "FAILED";
			}
		} else {
			console.error("FileItem :: 失敗...->", xhr.statusText);
			//エラーを格納
			status.value = "FAILED";
		}
	});

	//アップロード先のURLを指定
	xhr.open("POST", "/uploadfile");
	//アップロード中と設定
	status.value = "UPLOADING";
	//アップロードする
	xhr.send(formData);
};

onMounted(() => {
	//マウント時にそのままアップロードする
	//uploadFile();
	if (props.fileInput.uploadedFrom === "local") {
		uploadFile();
	}
});
</script>

<template>
  <span class="d-flex align-center">
    <p class="flex-grow-1 mr-2">{{ props.fileInput.fileBuffer?.name || props.fileInput.fileInfo?.name }}</p>
    <!-- クラウドから選択したファイルだった時の表示 -->
    <v-icon
      v-if="props.fileInput.uploadedFrom==='remote'"
      size="small"
      color="primary"
    >mdi-cloud-outline</v-icon>

    <!-- アップロードの成功表示 -->
    <v-icon
      v-if="status==='SUCCESS'"
      size="small"
      color="success"
    >mdi-check</v-icon>
    <!-- アップロードの失敗表示 -->
    <v-icon
      v-if="status==='FAILED'"
      size="small"
      color="error"
    >mdi-alert-circle-outline</v-icon>
    <!-- アップロード途中表示 -->
    <v-progress-circular
      v-if="status==='UPLOADING'"
      :model-value="progress"
      width="4"
      size="24"
    ></v-progress-circular>
  </span>
</template>