<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const apiClientCreateInfo = ref({
  name: "",
  description: ""
});
const resultSuccess = ref<boolean>(false);
const displayError = ref<boolean>(false);

/**
 * APIクライアント情報を作成する
 */
const createApiClient = () => {
  socket.emit("createApiClient", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    name: apiClientCreateInfo.value.name,
    description: apiClientCreateInfo.value.description
  });

  displayError.value = false;
}

/**
 * APIクライアントの作成結果受け取り
 * @param dat 
 */
const SOCKETcreateApiClient = (dat:{result:string, data:null}) => {
  if (dat.result === "SUCCESS") {
    resultSuccess.value = true;
  } else {
    displayError.value = true;
    resultSuccess.value = false;
  }
}

onMounted(() => {
  socket.on("RESULT::createApiClient", SOCKETcreateApiClient);
});

onUnmounted(() => {
  socket.off("RESULT::createApiClient", SOCKETcreateApiClient);
});
</script>

<template>
  <v-dialog max-width="650px">
    <m-card>
      <v-card-title>
        APIクライアントを作成
      </v-card-title>

      <v-card-text>

        <v-text-field
          v-model="apiClientCreateInfo.name"
          label="クライアント名"
        />

        <v-textarea
          v-model="apiClientCreateInfo.description"
          label="API概要、利用目的"
        />

        <v-alert v-if="displayError" type="error" variant="tonal">
          作成できませんでした。時間を置いて再度試してください。
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <m-btn
          v-if="!resultSuccess"
          @click="createApiClient"
          :disabled="apiClientCreateInfo.name === ''"
          color="primary"
        >
          作成する
        </m-btn>

        <v-alert v-if="resultSuccess" type="success" variant="tonal">
          成功!
        </v-alert>
      </v-card-actions>
    </m-card>
  </v-dialog>
</template>