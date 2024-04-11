<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useAppStatus } from '~/stores/AppStatus';
import { useHistory } from '~/stores/history';
import { useMyUserinfo } from "~/stores/userinfo";
import { useUserIndex } from "~/stores/userindex";
import type { channel } from '~/types/channel';

import { useElementVisibility } from '@vueuse/core'

const { getAppStatus } = storeToRefs(useAppStatus());
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
const displayDirection = ref<"newer"|"older">("older"); //履歴の取得、表示方向
const skeletonLoaderOlder = ref(null); //要素位置監視用
const atSkeletonOlder = useElementVisibility(skeletonLoaderOlder); //スケルトンローダーが画面内にあるかどうか
const skeletonLoaderNewer = ref(null); //要素位置監視用
const atSkeletonNewer = useElementVisibility(skeletonLoaderNewer); //スケルトンローダーが画面内にあるかどうか

/**
 * 古い履歴の追加取得
 */
const fetchOlderHistory = () => {
  //一番新しいメッセージID用変数
  let oldestMessageId:string = "";
  //メッセージIDを取得しようとして無理なのなら停止
  try {
    //履歴の長さカウント
  const lengthOfHistory = getHistoryFromChannel(props.channelInfo.channelId).length;
    //一番古いメッセージID
    oldestMessageId = getHistoryFromChannel(
      props.channelInfo.channelId
    )[lengthOfHistory-1].messageId;
  } catch(e) {
    return;
  }

  //console.log("/channel/:id :: fetchOlderHistory : oldestMessageId->", oldestMessageId);

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

  //履歴を取得中であるとグローバルで設定
  getAppStatus.value.fetchingHistory = true;

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
  //一番新しいメッセージID用変数
  let newestMessageId:string = "";
  //メッセージIDを取得しようとして無理なのなら停止
  try {
    newestMessageId = getHistoryFromChannel(
      props.channelInfo.channelId
    )[0].messageId;
  } catch(e) {
    return;
  }

  //console.log("/channel/:id :: fetchNewerHistory : newestMessageId->", newestMessageId);

  //履歴を取得
  socket.emit("fetchHistory", {
    RequestSender: {
      userId: getMyUserinfo.userId,
      sessionId: getSessionId
    },
    channelId: props.channelInfo.channelId,
    fetchingPosition: {
      positionMessageId: newestMessageId,
      fetchDirection: "newer"
    }
  });

  //履歴を取得中であるとグローバルで設定
  getAppStatus.value.fetchingHistory = true;

  console.log("/channel/:id :: fetchNewerHistory : 送信したもの->", {
    RequestSender: {
      userId: getMyUserinfo.userId,
      sessionId: getSessionId
    },
    channelId: props.channelInfo.channelId,
    fetchingPosition: {
      positionMessageId: newestMessageId,
      fetchDirection: "newer"
    }
  });
}

//上のスケルトンローダーの位置変数の監視
watch(atSkeletonOlder, function (newValue, oldValue) {
  console.log("/channel/:id :: watch(atSkeletonOlder) : atSkeleton->(", newValue, oldValue, ")",
    " fetching->", getAppStatus.value.fetchingHistory
  );

  //すでに履歴を取得中の状態なら停止
  if (getAppStatus.value.fetchingHistory) return;

  //もしスケルトンローダーの位置にいるのなら履歴を追加で取得
  if (newValue) {
    getAppStatus.value.fetchingHistory = true;
    fetchOlderHistory();
  }
});

//下のスケルトンローダーの位置変数の監視
watch(atSkeletonNewer, function (newValue, oldValue) {
  console.log("/channel/:id :: watch(atSkeletonNewer) : atSkeleton->(", newValue, oldValue, ")",
    " fetching->", getAppStatus.value.fetchingHistory
  );

  //すでに履歴を取得中の状態なら停止
  if (getAppStatus.value.fetchingHistory) return;

  //もしスケルトンローダーの位置にいるのなら履歴を追加で取得
  if (newValue) {
    getAppStatus.value.fetchingHistory = true;
    fetchNewerHistory();
  }
});

//履歴の更新
watch(
  () => getHistoryFromChannel(props.channelInfo.channelId),
  () => {
    console.log("/channel/:id :: watch(getHistory...) : 変更された?");
  },
  {deep: true}
);
</script>

<template>
  <div style="overflow-y:auto;">
    <div
      style="height:100%; overflow-y:auto;"
      class="d-flex flex-column-reverse py-1"
    >
      
      <!-- 終わりのロードホルダー -->
      <span
        v-if="
          !getHistoryAvailability(props.channelInfo.channelId).atEnd
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
        :id="message.messageId"
        class="d-flex my-1 px-1"
      >
        <v-avatar class="mr-2">
          <v-img :src="'/icon/' + message.userId" :alt="message.userId" />
        </v-avatar>
        <m-card class="flex-grow-1 d-flex flex-column">
          <span class="d-flex align-center">
            <p>{{ getUserinfo(message.userId).userName }}</p>
            <p class="text-medium-emphasis text-subtitle-2 ml-2">
              {{ message.time }}
            </p>
          </span>
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
        "
        class="mx-auto my-4 pa-5"
      >
        履歴はここまで
      </v-chip>

    </div>
  </div>
</template>
