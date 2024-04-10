<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useHistory } from '~/stores/history';
import { useMyUserinfo } from "~/stores/userinfo";
import { useUserIndex } from "~/stores/userindex";
import type { channel } from '~/types/channel';

import { useElementVisibility } from '@vueuse/core'

const { getMyUserinfo, getSessionId } = useMyUserinfo();
const { getUserinfo } = useUserIndex();

//props(チャンネル情報)
const props = defineProps<{
  channelInfo: channel
}>();

const { getHistoryFromChannel, getHistoryAvailability } = useHistory();

/**
 * data
 */
const skeletonLoader = ref(null); //要素位置監視用
const atSkeleton = useElementVisibility(skeletonLoader); //スケルトンローダーが画面内にあるかどうか

/**
 * 古い履歴の追加取得
 */
const fetchOlderHistory = () => {
  //履歴の長さカウント
  const lengthOfHistory = getHistoryFromChannel(props.channelInfo.channelId).length;
  //一番古いメッセージID
  const oldestMessageId = getHistoryFromChannel(
    props.channelInfo.channelId
  )[lengthOfHistory-1].messageId;
  
  console.log("/channel/:id :: fetchOlderHistory : oldestMessageId->", oldestMessageId);

  //履歴を取得
  socket.emit("fetchHistory", {
    RequestSender: {
      userId: getMyUserinfo.userId,
      sessionId: getSessionId
    },
    channelId: props.channelInfo.channelId,
    fetchingPosition: {
      positionMessageId: oldestMessageId,
      fetchDirection: "older"
    }
  });

  console.log("/channel/:id :: fetchOlderHistory : 送信したもの->", {
    RequestSender: {
      userId: getMyUserinfo.userId,
      sessionId: getSessionId
    },
    channelId: props.channelInfo.channelId,
    fetchingPosition: {
      positionMessageId: oldestMessageId,
      fetchDirection: "older"
    }
  });

}

//スケルトンローダーの位置変数の監視
watch(atSkeleton, function (newValue, oldValue) {
  console.log("/channel/:id :: watch(atSkeleton) : atSkeleton->", newValue, oldValue);

  //もしスケルトンローダーの位置にいるのなら履歴を追加で取得
  if (newValue) {
    fetchOlderHistory();
  }
});
</script>

<template>
  <div style="overflow-y:auto;">
    <div style="height:100%; overflow-y:auto;" class="d-flex flex-column-reverse py-1">
      
      <div
        v-for="
          (message, index)
            of
          getHistoryFromChannel(props.channelInfo.channelId)
        "
        :key="message.messageId"
        class="d-flex my-1 px-1"
      >
        <v-avatar class="mr-2">
          <v-img :src="'/icon/' + message.userId" :alt="message.userId" />
        </v-avatar>
        <m-card class="flex-grow-1 d-flex flex-column">
          <span>{{ getUserinfo(message.userId).userName }}</span>
          <p class="text-medium-emphasis">{{ message.content }}</p>
        </m-card>
      </div>

      <!-- 戦闘のロードホルダー -->
      <span
        v-if="!getHistoryAvailability(props.channelInfo.channelId).atTop"
        ref="skeletonLoader"
      >
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
      </span>

      <!-- 履歴の先頭だった用の表示 -->
      <v-chip class="mx-auto my-4 pa-5" v-if="getHistoryAvailability(props.channelInfo.channelId).atTop">
        ここが先頭
      </v-chip>

    </div>
  </div>
</template>
