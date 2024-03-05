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
 * チャンネル参加
 */
const joinChannel = (channelIdJoining:string) => {
  socket.emit("joinChannel", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: channelIdJoining
  });
}

/**
 * チャンネルリストを受信
 * @param dat
 */
const SOCKETRfetchChannelList = (dat:{result:string, data:channel[]}) => {
  console.log("auth :: SOCKETRfetchChannelList : dat->", dat);
  channelList.value = dat.data; //格納
}

/**
 * チャンネルリストを受信
 * @param dat
 */
const SOCKETjoinChannel = (dat:{result:string, data:boolean}) => {
  console.log("auth :: SOCKETjoinChannel : dat->", dat);
  //成功なら自分のユーザー情報を取得して更新する
  if (dat.result === "SUCCESS") {
    //取得
    socket.emit("fetchUserInfo", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value
      },
      userId: getMyUserinfo.value.userId
    });
  }
}

onMounted(() => {
  socket.on("RESULT::fetchChannelList", SOCKETRfetchChannelList);
  socket.on("RESULT::joinChannel", SOCKETjoinChannel);

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
  socket.off("RESULT::joinChannel", SOCKETjoinChannel);
});
</script>

<template>
  <!-- チャンネル作成ダイアログ -->
  <BrowserCreateChannel
    v-model="displayCreateChannel"
    @closeDialog="displayCreateChannel = false"
  />

  <div class="pt-5 px-5 d-flex flex-column" style="height:100%;">
    
    <p class="text-h5">チャンネルブラウザ</p>
    <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />
    <div class="pt-3 px-2" style="overflow-y:auto; padding-bottom:15vh;">
      <!-- チャンネルカード -->
      <m-card v-for="channel of channelList" class="mb-2 pb-3 pt-2 d-flex-column">
        
        <span class="d-flex align-center py-1" style="width:100%;">
          <v-icon v-if="channel.isPrivate">mdi-lock</v-icon>
          <p class="text-h6">{{ channel.channelName }}</p>
          <v-divider vertical class="mx-2 my-1" />
          <p class="text-truncate">{{ channel.description }}</p>
          <m-btn
            @click="joinChannel(channel.channelId)"
            class="ml-auto"
          >
            参加
          </m-btn>
        </span>
        <v-divider />
        <p class="text-disabled text-caption">作成者 : {{ channel.createdBy }}</p>

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
