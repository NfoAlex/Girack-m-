<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import { useUserIndex } from '~/stores/userindex';
import getMyRolePower from '~/composables/getMyRolePower';

import type { channel } from '~/types/channel';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getUserinfo } = storeToRefs(useUserIndex());

/**
 * data
 */
const channelList = ref<channel[]>(); //チャンネル情報格納用
const stateLoding = ref<boolean>(true); //チャンネル情報を受信できたかどうか
const channelInfoDeleting = ref<{ //削除する予定のチャンネルの基本情報
  channelId:string, channelName:string
}>({
  channelId: "",
  channelName: ""
});

const displayCreateChannel = ref<boolean>(false); //チャンネル作成画面表示
const displayDeleteChannel = ref<boolean>(false); //チャンネル削除画面表示

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

  //参加するチャンネルの履歴を取得
  socket.emit("fetchHistory", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: channelIdJoining,
    fetchingPosition: {
      positionMessageId: "", //最新からとるために空(将来的に既読時間からやるようにする)
      fetchDirection: "newer"
    }
  });
}

/**
 * チャンネル脱退
 */
const leaveChannel = (channelIdLeaving:string) => {
  socket.emit("leaveChannel", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: channelIdLeaving
  });
}

/**
 * チャンネル削除
 */
const deleteChannel = (channelIdDeleting:string) => {
  socket.emit("deleteChannel", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: channelIdDeleting
  });
  //チャンネル削除確認ダイアログを非表示に
  displayDeleteChannel.value = false;
  //チャンネル削除確認用の情報変数を初期化
  channelInfoDeleting.value = {
    channelId: "",
    channelName: ""
  };
}

/**
 * チャンネルリストの取得
 */
const fetchChannelListTrigger = () => {
  socket.emit("fetchChannelList", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
}

/**
 * チャンネルリストを受信
 * @param dat
 */
const SOCKETRfetchChannelList = (dat:{result:string, data:channel[]}) => {
  //console.log("browser :: SOCKETRfetchChannelList : dat->", dat);
  stateLoding.value = false; //ロード中状態を解除
  channelList.value = dat.data; //格納
}

/**
 * チャンネル参加結果受け取り
 * @param dat
 */
const SOCKETjoinChannel = (dat:{result:string, data:string}) => {
  console.log("browser :: SOCKETjoinChannel : dat->", dat);
  //成功なら自分のユーザー情報と履歴を取得して更新する
  if (dat.result === "SUCCESS") {
    //自分情報取得
    socket.emit("fetchUserInfo", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value
      },
      userId: getMyUserinfo.value.userId
    });
    //履歴
    socket.emit("fetchHistory", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value
      },
      channelId: dat.data,
      fetchingPosition: {
        positionMessageId: '',
        includeThisPosition: true,
        fetchDirection: "older"
      }
    });
  }
}

/**
 * チャンネル脱退結果受け取り
 * @param dat
 */
const SOCKETleaveChannel = (dat:{result:string, data:boolean}) => {
  console.log("browser :: SOCKETleaveChannel : dat->", dat);
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

/**
 * チャンネル削除結果の受け取り
 * @param dat 
 */
const SOCKETdeleteChannel = (dat:{result:string, data:string}) => {
  //チャンネルリストの取得
  socket.emit("fetchChannelList", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
}

onMounted(() => {
  socket.on("RESULT::fetchChannelList", SOCKETRfetchChannelList);
  socket.on("RESULT::joinChannel", SOCKETjoinChannel);
  socket.on("RESULT::leaveChannel", SOCKETleaveChannel);
  socket.on("RESULT::deleteChannel", SOCKETdeleteChannel);

  //チャンネルリストの取得
  fetchChannelListTrigger();
});

onUnmounted(() => {
  socket.off("RESULT::fetchChannelList", SOCKETRfetchChannelList);
  socket.off("RESULT::joinChannel", SOCKETjoinChannel);
  socket.off("RESULT::leaveChannel", SOCKETleaveChannel);
  socket.off("RESULT::deleteChannel", SOCKETdeleteChannel);
});
</script>

<template>
  <!-- チャンネル作成ダイアログ -->
  <BrowserCreateChannel
    v-model="displayCreateChannel"
    @closeDialog="displayCreateChannel = false"
  />

  <!-- チャンネル削除ダイアログ -->
  <v-dialog
    v-model="displayDeleteChannel"
    style="max-width: 750px; width: 85vw"
    transition="blank"
  >
    <m-card>
      <v-card-title>
        チャンネルの削除確認
      </v-card-title>
      <v-card-text>
        次のチャンネルを削除します
        <p class="text-center text-h5 my-4">{{ channelInfoDeleting.channelName }}</p>
      </v-card-text>
      <v-card-actions class="d-flex flex-row-reverse">
        <m-btn
          @click="deleteChannel(channelInfoDeleting.channelId)"
          color="error"
        >
          削除する
        </m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>

  <div class="pt-5 px-5 d-flex flex-column" style="height:100%;">
    
    <span class="d-flex align-center">
      <p
        class="text-h5"
        style="font-weight:700;"
      >チャンネルブラウザ</p>
      <v-btn
        @click="fetchChannelListTrigger"
        color="primary"
        class="ml-auto"
        icon="mdi:mdi-refresh"
        rounded="lg"
      />
    </span>
    <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />
    <div class="pt-3 px-2" style="overflow-y:auto; padding-bottom:15vh;">
      <!-- チャンネルロード中表示 -->
      <div v-if="stateLoding" style="width:fit-content;" class="mx-auto my-10">
        <v-progress-circular :size="50" indeterminate />
      </div>

      <!-- チャンネルカード -->
      <m-card v-for="channel of channelList" class="mb-2 pb-3 pt-2 d-flex-column">
        
        <span class="d-flex align-center py-2" style="width:100%;">
          <v-icon v-if="channel.isPrivate">mdi-lock</v-icon>
          <p class="text-h6">{{ channel.channelName }}</p>
          <v-divider vertical class="mx-2 my-1" />
          <p class="text-truncate">{{ channel.description }}</p>
          <span class="ml-auto">
            <m-btn
              v-if="getMyRolePower().ChannelManage"
              @click="
                displayDeleteChannel = true;
                channelInfoDeleting = {
                  channelName:channel.channelName,
                  channelId: channel.channelId
                };
              "
              icon="mdi-delete"
              size="small"
              color="error"
              class="mx-2"
            />
            <m-btn
              v-if="!getMyUserinfo.channelJoined.includes(channel.channelId)"
              @click="joinChannel(channel.channelId)"
              
            >
              参加
            </m-btn>
            <m-btn
              v-else
              @click="leaveChannel(channel.channelId)"
              variant="outlined"
            >
              退出
            </m-btn>
          </span>
        </span>
        <v-divider />
        <p class="text-disabled text-caption">作成者 : {{ getUserinfo(channel.createdBy).userName }}</p>

      </m-card>
    </div>
    
  </div>

  <!-- チャンネル作成ボタン -->
  <v-btn
    v-if="getMyRolePower().ChannelManage"
    @click="displayCreateChannel = true"
    position="absolute"
    style="right:5%; bottom: 5%;"
    color="primary"
    icon="mdi:mdi-plus"
    size="x-large"
    rounded="lg"
  />
</template>
