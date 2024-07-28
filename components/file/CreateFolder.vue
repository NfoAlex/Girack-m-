<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

import type { folder } from "~/types/file";

const props = defineProps<{
	currentDirectory: folder;
}>();

/**
 * data
 */
const inputFolderName = ref<string>("");

/**
 * フォルダーを作成
 */
const createFolder = () => {
	socket.emit("createFolder", {
		RequestSender: {
			userId: getMyUserinfo.value.userId,
			sessionId: getSessionId.value,
		},
		folderName: inputFolderName.value,
		directoryId: props.currentDirectory.id,
	});
};

/**
 * フォルダー作成結果受け取り
 */
const SOCKETcreateFolder = (dat: { result: string; dat: null }) => {
	console.log("SOCKETcreateFolder :: dat->", dat);

	//成功なら今いるフォルダ構成を再取得
	if (dat.result === "SUCCESS") {
		socket.emit("fetchFolders", {
			RequestSender: {
				userId: getMyUserinfo.value.userId,
				sessionId: getSessionId.value,
			},
			positionedDirectoryId: props.currentDirectory.id,
		});
	}
};

onMounted(() => {
	socket.on("RESULT::createFolder", SOCKETcreateFolder);
});

onUnmounted(() => {
	socket.off("RESULT::createFolder", SOCKETcreateFolder);
});
</script>

<template>
  <m-card>
    <v-card-title>
      フォルダー作成
    </v-card-title>

    <v-card-text>
      <p>フォルダを作るディレクトリ -> {{ props.currentDirectory.name }}</p>
      <v-text-field
        v-model="inputFolderName"
        variant="outlined"
        label="フォルダ名"
      />
    </v-card-text>

    <v-card-actions>
      <m-btn @click="createFolder" color="primary">
        作成
      </m-btn>
    </v-card-actions>
  </m-card>
</template>