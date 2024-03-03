<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import type { channel } from '~/types/channel';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const channelList = ref<channel[]>(); //チャンネル情報格納用
const displayCreateChannel = ref<boolean>(false); //チャンネル作成画面表示

/**
 * チャンネルリストを受信
 * @param dat
 */
const SOCKETRfetchChannelList = (dat:{result:string, data:channel[]}) => {
  console.log("auth :: SOCKETRfetchChannelList : dat->", dat);
  channelList.value = dat.data; //格納
}

onMounted(() => {
  socket.on("RESULT::fetchChannelList", SOCKETRfetchChannelList);

  //チャンネルリストの取得
  socket.emit("fetchChannelList", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchChannelList", SOCKETRfetchChannelList);
})
</script>

<template>
  <!-- チャンネル作成ダイアログ -->
  <BrowserCreateChannel
    v-model="displayCreateChannel"
    @closeDialog="displayCreateChannel = false"
  />

  <div class="pt-5 px-5 d-flex flex-column" style="height:100%;">
    
    <p class="text-h5">ここがチャンネルブラウザ</p>
    <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />
    <div class="pb-5 pt-3 px-2" style="overflow-y:auto;">
      <m-card v-for="channel of channelList" class="mb-2 d-flex-column">
        
        <span class="d-flex align-center py-1">
          <v-icon v-if="channel.isPrivate">mdi-lock</v-icon>
          <p class="text-h6">{{ channel.channelName }}</p>
        </span>
        <v-divider />
        <div class="py-2 px-1">
          {{ channel.description }}
        </div>

      </m-card>
    </div>
    
  </div>

  <!-- チャンネル作成ボタン -->
  <v-btn
    @click="displayCreateChannel = true"
    position="absolute"
    style="right:5%; bottom: 5%;"
    color="secondary"
    icon="mdi:mdi-plus"
    size="x-large"
  />
</template>
