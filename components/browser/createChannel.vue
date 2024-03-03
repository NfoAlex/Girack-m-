<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from "../../stores/userinfo";
import type { channel } from '~/types/channel';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const channelCreationData = ref<any>({
  channelName: '',
  description: '',
  isPrivate: false,
});

const channelCreateResult = ref<"SUCCESS"|"ERROR"|null>(null);

/**
 * チャンネルを作成する
 */
const createChannel = () => {
  socket.emit("createChannel", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelName: channelCreationData.value.channelName,
    description: channelCreationData.value.description,
    isPrivate: channelCreationData.value.isPrivate,
  })
};

/**
 * チャンネル作成結果受け取り
 * @param dat
 */
const SOCKETcreateChannel = (dat:{result:string, data:boolean|null}) => {
  console.log("createChannel :: SOCKETcreateChannel : dat->", dat);
  if (dat.result !== "SUCCESS") {
    channelCreateResult.value = "ERROR";
  } else {
    channelCreateResult.value = "SUCCESS";
  }
};

onMounted(() => {
  socket.on("RESULT::createChannel", SOCKETcreateChannel);
});

onUnmounted(() => {
  socket.off("RESULT::createChannel", SOCKETcreateChannel);
})

</script>

<template>
  <v-dialog
    style="max-width: 750px; width: 85vw"
  >
    <m-card v-if="channelCreateResult!=='SUCCESS'">
      <v-card-title>
        チャンネルの作成
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="channelCreationData.channelName"
          label="チャンネル名"
          variant="outlined"
          prepend-inner-icon="mdi-pound"
        />
        <v-textarea
          v-model="channelCreationData.description"
          label="チャンネル概要"
          variant="outlined"
        />

        <v-switch
          v-model="channelCreationData.isPrivate"
          prepend-icon="mdi-lock"
          label="プライベートチャンネル"
          persistent-hint
          hint="招待からでしか参加できなくなります"
          density="compact"
        />
        <v-alert
          v-if="channelCreateResult==='ERROR'"
          type="error"
          class="mt-5"
        >内部エラー。後でもう一度試してください。</v-alert>
      </v-card-text>

      <v-card-actions class="d-flex flex-row-reverse">
        <m-btn @click="createChannel()" color="primary">作成!</m-btn>
      </v-card-actions>
      
    </m-card>
    <m-card v-if="channelCreateResult==='SUCCESS'">
      <v-card-title>チャンネルの作成</v-card-title>
      <v-card-text class="text-center">
        チャンネルを作成しました!
      </v-card-text>
      <v-card-actions  class="d-flex flex-row-reverse">
        <m-btn @click="$emit('closeDialog')">閉じる</m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>
</template>