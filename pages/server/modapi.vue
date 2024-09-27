<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";
import type { IAPIClientInfo } from "~/types/api";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const APIInfos = ref<IAPIClientInfo[]>([]);

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

  //API情報取得
  socket.emit("fetchAllApiInfo", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchAllApiInfo", SOCKETfetchAllApiInfo);
});
</script>

<template>
  <div style="height:100%;">
    <NuxtLayout name="server" style="height:100%;">
      ここでAPI管理
      <m-card v-for="apiClient,index of APIInfos">
        {{ apiClient }}
      </m-card>
    </NuxtLayout>
  </div>
</template>