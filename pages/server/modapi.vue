<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";
import { useUserIndex } from "~/stores/userindex";
import type { IAPIClientInfo } from "~/types/api";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getUserinfo } = storeToRefs(useUserIndex());

/**
 * data
 */
const APIInfos = ref<IAPIClientInfo[]>([]);

/**
 * API情報取得
 */
const fetchAllApiInfo = () => {
  socket.emit("fetchAllApiInfo", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
}

/**
 * API利用情報の承諾状態を更新する
 * @param apiClientId 
 * @param newStatus 
 */
const changeApproveStatus = (apiClientId: string, newStatus: IAPIClientInfo["approvedStatus"]) => {
  console.log("modapi :: changeApproveStatus : 更新->", newStatus);
}

/**
 * API利用情報を取得
 * @param dat
 */
const SOCKETfetchAllApiInfo = (dat:{result:string, data:IAPIClientInfo[] | null}) => {
  console.log("modapi :: SOCKETfetchAllApiInfo : dat->", dat);

  if (dat.data) {
    APIInfos.value = dat.data;
  }
}

onMounted(() => {
  socket.on("RESULT::fetchAllApiInfo", SOCKETfetchAllApiInfo);

  fetchAllApiInfo();
});

onUnmounted(() => {
  socket.off("RESULT::fetchAllApiInfo", SOCKETfetchAllApiInfo);
});
</script>

<template>
  <div style="height:100%;">
    <NuxtLayout name="server" style="height:100%;">
      <div class="d-flex flex-row mb-2">
        <v-btn
          @click="fetchAllApiInfo"
          color="primary"
          rounded="lg"
          class="ml-auto"
          icon="mdi-refresh"
        />
      </div>
      <m-card v-for="apiClient,index of APIInfos">
        <div class="d-flex flex-row align-center">
          <v-icon
            size="x-small"
            class="mr-2"
            :color="apiClient.isEnabled ? 'success' : 'error'"
          >mdi-circle</v-icon>
          <p>{{ apiClient.clientName }}</p>
          <v-divider vertical class="mx-2" />
          <p class="text-truncate">{{ apiClient.description }}</p>
        </div>
        <v-divider class="my-2" />
        <div class="d-flex flex-row align-center flex-wrap mb-2">
          <v-chip class="mr-2">最新利用日時 : {{ apiClient.latestUsedTime || "未利用" }}</v-chip>
          <v-chip class="mr-2">{{ getUserinfo(apiClient.createdUserId).userName }}</v-chip>
        </div>
        <v-btn-toggle
          v-model="apiClient.approvedStatus"
          @update:model-value="changeApproveStatus(apiClient.apiClientId, apiClient.approvedStatus)"
          variant="outlined"
          rounded="xl"
        >
          <v-btn icon="mdi-cancel" size="small" value="BANNED"></v-btn>
          <v-btn icon="mdi-check-bold" size="small" value="APPROVED"></v-btn>
        </v-btn-toggle>
        {{ apiClient.approvedStatus }}
      </m-card>
    </NuxtLayout>
  </div>
</template>