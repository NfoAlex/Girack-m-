<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';

import type { channel } from '~/types/channel';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

//prop
const props = defineProps<{
  channelId: string
}>();

/**
 * data
 */
const channelInfo = ref<channel>({ //チャンネルデータ
  channelId: '...',
  channelName: '...',
  createdBy: '',
  description: '',
  isPrivate: false,
  speakableRole: ''
});
const tabPage = ref<"INFO"|"MANAGE">("INFO"); //表示するタブ指定用
const tempDescriptionEditing = ref<string>(""); //チャンネル概要文編集用

/**
 * チャンネル更新
 */
const updateChannel = () => {
  //チャンネル情報を取得
  socket.emit("updateChannel", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: props.channelId,
    channelInfo: {
      ...channelInfo.value,
      description: tempDescriptionEditing.value
    }
  });
}

/**
 * チャンネルデータ受け取り
 * @param dat 
 */
const SOCKETfetchChannelInfo = (
  dat: {
    result: string,
    data: {
      channelId: string,
      channelInfo: channel
    }
  }
) => {
  console.log("Channelinfo :: SOCKETfetchChannelInfo : dat->", dat);

  if (dat.result === "SUCCESS") {
    //チャンネルデータ格納
    channelInfo.value = dat.data.channelInfo;
    tempDescriptionEditing.value = dat.data.channelInfo.description;
  }
};

onMounted(() => {
  socket.on("RESULT::fetchChannelInfo", SOCKETfetchChannelInfo);

  //チャンネル情報を取得
  socket.emit("fetchChannelInfo", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: props.channelId
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchChannelInfo", SOCKETfetchChannelInfo);
});
</script>

<template>
  <v-dialog width="65vw" max-width="800px" height="35vh" min-height="300px" max-height="500px">
    <m-card style="height:100%;" class="pt-8 d-flex">
      <span class="d-flex align-center mb-2">
        <v-icon size="large" class="mr-1">mdi-pound</v-icon>
        <p class="text-h5 text-truncate">{{ channelInfo.channelName }}</p>
      </span>

      <!-- タブ -->
      <span class="mt-2">
        <m-btn
          @click="tabPage='INFO'"
          :variant="tabPage==='INFO'?'tonal':'text'"
        >
          情報
        </m-btn>
        <m-btn
          @click="tabPage='MANAGE'"
          :variant="tabPage==='MANAGE'?'tonal':'text'"
        >
          管理
        </m-btn>
      </span>

      <!-- 表示部分 -->
      <m-card color="cardInner mt-2 flex-grow-1" style="height:20%; overflow-y:auto;">
        
        <!-- 概要部分 -->
        <div
          v-if="tabPage==='INFO'"
          style="margin:0; padding:0; height:100%;"
          class=""
        >
          <v-textarea
            variant="plain"
            v-model="tempDescriptionEditing"
            no-resize
            auto-grow
            class="flex-grow-1 align-self-auto"
            hide-details
          />
          <m-card-compact
            v-if="tempDescriptionEditing !== channelInfo.description"
            class="ml-auto d-flex flex-row justify-end pa-1"
            color="sidebarBackground"
            width="fit-content"
            style="position:sticky; bottom:0px; right:0;"
          >
            <m-btn
              @click="updateChannel"
              variant="text"
              icon="mdi-check"
              size="small"
            />
            <m-btn
              @click="tempDescriptionEditing=channelInfo.description"
              variant="text"
              icon="mdi-close"
              size="small"
            />
          </m-card-compact>
        </div>

      </m-card>
    </m-card>
  </v-dialog>
</template>
