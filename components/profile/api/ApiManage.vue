<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";
import type { IAPIClientInfo } from "~/types/api";
import ApiClientCreate from "./ApiClientCreate.vue";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const apiClientInfos = ref<IAPIClientInfo[]>([]);
const displayAPIClientCreate = ref<boolean>(false);

/**
 * api管理情報受け取り用ハンドラ
 */
const SOCKETfetchApiInfo = (dat: {
  result: string;
  data: IAPIClientInfo[];
}) => {
  console.log("api :: SOCKETfetchApiInfo : dat->", dat);

  if (dat.result === "SUCCESS") {
    apiClientInfos.value = dat.data;
  }
};

onMounted(() => {
  socket.on("RESULT::fetchApiInfo", SOCKETfetchApiInfo);

  socket.emit("fetchApiInfo", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchApiInfo", SOCKETfetchApiInfo);
});
</script>

<template>
  <ApiClientCreate v-model="displayAPIClientCreate" v-if="displayAPIClientCreate" />

  <div style="height:100%; overflow-y:auto;" class="pt-2 pb-3">
    <m-card v-for="apiClient of apiClientInfos" class="mb-2">
      {{ apiClient }}
    </m-card>
  </div>

  <!-- チャンネル作成ボタン -->
  <v-btn
    @click="displayAPIClientCreate = true"
    position="absolute"
    style="right:5%; bottom: 5%;"
    color="primary"
    icon="mdi:mdi-plus"
    size="x-large"
    rounded="xl"
  />
</template>