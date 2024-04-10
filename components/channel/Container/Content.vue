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
const skeletonLoaderOlder = ref(null); //要素位置監視用
const atSkeletonOlder = useElementVisibility(skeletonLoaderOlder); //スケルトンローダーが画面内にあるかどうか
const skeletonLoaderNewer = ref(null); //要素位置監視用
const atSkeletonNewer = useElementVisibility(skeletonLoaderNewer); //スケルトンローダーが画面内にあるかどうか

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

/**
 * 新しい履歴の追加取得
 */
 const fetchNewerHistory = () => {
  //一番新しいメッセージID
  const oldestMessageId = getHistoryFromChannel(
    props.channelInfo.channelId
  )[0].messageId;

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
      fetchDirection: "newer"
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
      fetchDirection: "newer"
    }
  });
}

//上のスケルトンローダーの位置変数の監視
watch(atSkeletonOlder, function (newValue, oldValue) {
  console.log("/channel/:id :: watch(atSkeletonOlder) : atSkeleton->", newValue, oldValue);

  //もしスケルトンローダーの位置にいるのなら履歴を追加で取得
  if (newValue) {
    fetchOlderHistory();
  }
});

//下のスケルトンローダーの位置変数の監視
watch(atSkeletonNewer, function (newValue, oldValue) {
  console.log("/channel/:id :: watch(atSkeletonNewer) : atSkeleton->", newValue, oldValue);

  //もしスケルトンローダーの位置にいるのなら履歴を追加で取得
  if (newValue) {
    fetchNewerHistory();
  }
});

watch(getHistoryAvailability(props.channelInfo.channelId), () => {
  console.log("/channel/:id :: watch(atSkeleton) : 履歴が変わった?");
});
</script>

<template>
  <div style="overflow-y:auto;">
    <div style="height:100%; overflow-y:auto;" class="d-flex flex-column-reverse py-1">
      
      <!-- 終わりのロードホルダー -->
      <span
        v-if="
          !getHistoryAvailability(props.channelInfo.channelId).atEnd
          &&
          getHistoryFromChannel(props.channelInfo.channelId).length > 30
        "
        ref="skeletonLoaderNewer"
      >
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
      </span>

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
        ref="skeletonLoaderOlder"
      >
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
      </span>

      <!-- 履歴の先頭だった用の表示 -->
      <v-chip
        v-if="
          getHistoryAvailability(props.channelInfo.channelId).atTop
          &&
          getHistoryFromChannel(props.channelInfo.channelId).length > 30
        "
        class="mx-auto my-4 pa-5"
      >
        履歴はここまで
      </v-chip>

    </div>
  </div>
</template>
