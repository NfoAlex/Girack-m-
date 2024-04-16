<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useGoTo } from 'vuetify'
import { useAppStatus } from '~/stores/AppStatus';
import { useHistory } from '~/stores/history';
import { useMyUserinfo } from "~/stores/userinfo";
import { useMessageReadId } from "~/stores/messageReadId";
import updateMessageReadIdCloudAndLocal from "~/composables/updateMessageReadIdCloudAndLocal";
import MessageRender from './Content/MessageRender.vue';
import type { channel } from '~/types/channel';

import { useElementVisibility, useScroll, useWindowFocus } from '@vueuse/core';

//スクロール位置取得用
const ChannelContainerContent = ref<HTMLElement | null>(null);
const { y } = useScroll(ChannelContainerContent)
//ウィンドウのフォーカス取得用
const windowFocused = useWindowFocus();

//Storeデータ用
const { getAppStatus } = storeToRefs(useAppStatus());
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getHistoryFromChannel, getHistoryAvailability } = useHistory();
const { getMessageReadId } = useMessageReadId();
const goTo = useGoTo();

//props(チャンネル情報)
const props = defineProps<{
  channelInfo: channel
}>();

/**
 * data
 */
const displayDirection = ref<"newer"|"older">("older"); //履歴の取得、表示方向
const skeletonLoaderOlder = ref(null); //要素位置監視用
const atSkeletonOlder = useElementVisibility(skeletonLoaderOlder); //スケルトンローダーが画面内にあるかどうか
const skeletonLoaderNewer = ref(null); //要素位置監視用
const atSkeletonNewer = useElementVisibility(skeletonLoaderNewer); //スケルトンローダーが画面内にあるかどうか
const latestMessageAnchor = ref(null); //最新メッセージ要素監視用
const atLatestMessage = useElementVisibility(latestMessageAnchor); //最終メッセージを見ているかどうか

const stateLoaded = ref<boolean>(false); //履歴や処理準備ができたかどうか

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
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
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
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
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
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
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
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: props.channelInfo.channelId,
    fetchingPosition: {
      positionMessageId: newestMessageId,
      fetchDirection: "newer"
    }
  });
}

/**
 * メッセージ枠のスタイル計算用
 */
const calculateMessageBorder = (messageIndex:number) => {
  //メッセージの前後を取得
  const messageAvailable = {
    before: getHistoryFromChannel(props.channelInfo.channelId)[messageIndex - 1] || null,
    here: getHistoryFromChannel(props.channelInfo.channelId)[messageIndex],
    next: getHistoryFromChannel(props.channelInfo.channelId)[messageIndex + 1] || null,
  };

  //最初のメッセージだったら
  if (messageIndex === 0) {
    // console.log("/channel/:id :: calculateMessageBorder : 次のメッセージ->",
    //   getHistoryFromChannel(props.channelInfo.channelId)[messageIndex + 1]
    // );

    //かつ次のメッセージがないなら
    if (messageAvailable.next === null) return "messageSingle";

    //次のメッセージが違う送信者なら
    if (messageAvailable.next.userId !== messageAvailable.here.userId) {
      return "messageSingle";
    } else {
      return "messageBottom";
    }
  } else if (messageAvailable.next === null) { //最初でなく、次のメッセージがなければ(最後)
    if (messageAvailable.before.userId === messageAvailable.here.userId) {
      return "messageTop";
    } else {
      return "messageSingle";
    }
  } else { //最初でも最後のメッセージでもないなら
    //次のメッセージと同じ送信者で
    if (messageAvailable.next.userId === messageAvailable.here.userId) {
      //かつ前のメッセージとも同じなら
      if (messageAvailable.before.userId === messageAvailable.here.userId) {
        return "messageMiddle";
      } else {
        return "messageBottom";
      }
    } else {
      if (messageAvailable.before.userId === messageAvailable.here.userId) {
        return "messageTop";
      } else {
        return "messageSingle";
      }
    }
  }
}

// *************  位置監視  ************* //
//上のスケルトンローダーの位置変数の監視
watch(atSkeletonOlder, function (newValue, oldValue) {
  //ロードできてないなら停止
  if (!stateLoaded) return;

  //すでに履歴を取得中の状態なら停止
  if (getAppStatus.value.fetchingHistory) return;

  //もしスケルトンローダーの位置にいるのなら履歴を追加で取得
  if (newValue) {
    displayDirection.value = "older"
    
    //console.log("/channel/:id :: watch(atSkeletonOlder) : もとに戻った");

    getAppStatus.value.fetchingHistory = true;
    setTimeout(fetchOlderHistory, 100);
  }
});

//下のスケルトンローダーの位置変数の監視
watch(atSkeletonNewer, function (newValue, oldValue) {
  //ロードできてないなら停止
  if (!stateLoaded) return;

  //すでに履歴を取得中の状態なら停止
  if (getAppStatus.value.fetchingHistory) return;

  //もしスケルトンローダーの位置にいるのなら履歴を追加で取得
  if (newValue) {
    displayDirection.value = "newer";

    //console.log("/channel/:id :: watch(atSkeletonNewer) : REVERSED!");

    getAppStatus.value.fetchingHistory = true;
    setTimeout(fetchNewerHistory, 100);
  }
});

//最新のメッセージにいるかどうか
watch(atLatestMessage, function (newValue, oldValue) {
  console.log("/channel/:id :: watch(atLatestMessage) : 最新にいそうだな->", newValue);

  //表示している内の最新のメッセージIDを取得
  const latestMessageId = getHistoryFromChannel(props.channelInfo.channelId)[0].messageId

  //最新既読Idを更新
  updateMessageReadIdCloudAndLocal(props.channelInfo.channelId, latestMessageId);
});

// *************  履歴監視の取得状態監視  ************* //
//履歴の更新を監視
watch(
  getAppStatus,
  (newValue, oldValue) => {
    nextTick(() => {
      //console.log("/channel/:id :: watch(getHistory...) : 変更された?", newValue, oldValue);
      
      // ❗ ↓新しい方の履歴を取得した際のみ↓ ❗ //

      //履歴を取り終えたとき、履歴を取得した位置からスクロールする
      if (displayDirection.value === "newer" && !newValue.fetchingHistory) {
        try {
          //履歴追加をし始めた位置
          const messageScrolledPosition = getHistoryFromChannel(
              props.channelInfo.channelId
            )[
              getHistoryAvailability(props.channelInfo.channelId).latestFetchedHistoryLength - 1
            ].messageId;

          setTimeout(() => {
            goTo("#msg" + messageScrolledPosition, {
              duration: 0,
              container: "#ChannelContainerContent"
            });
          }, 10);
        } catch(e) {
          //なにもしない
        }
      }
    });
  },
  {deep: true}
);

// *************  ウィンドウフォーカス  ************* //
//フォーカスしたとき、一番下にいるのなら最新既読Idを更新
watch(windowFocused, (newValue, oldValue) => {
  if (newValue && y.value === 0) {
    //最新メッセIDを取得
    const latestMessageId = getHistoryFromChannel(props.channelInfo.channelId)[0].messageId;
    //Storeとサーバーで同期
    updateMessageReadIdCloudAndLocal(props.channelInfo.channelId, latestMessageId);
  }
});

// *************  スクロール関係  ************* //
//スクロール位置の変更監視して記憶するように
watch(y, () => {
  //console.log("/channel/:id :: watch(y) : y.value->", y.value);
  sessionStorage.setItem('scrollPositionY::'+props.channelInfo.channelId, y.value.toString());
});

// *************  チャンネル情報  ************* //
//チャンネル情報の変更を監視してスクロール位置を戻す
watch(props, (newProp, oldProp) => {
  //スクロール位置を取り出し
  const scrollPosition = sessionStorage.getItem(
    "scrollPositionY::" + oldProp.channelInfo.channelId
  );
  //もしnullなら既読Idへスクロールしてみる
  if (scrollPosition === null) {
    //スクロールする
    goTo(
      "#msg" + getMessageReadId(props.channelInfo.channelId),
      {
      duration: 0,
      container: "#ChannelContainerContent"
      }
    );
    //そして終わる
    return;
  }

  //取り出したものを数値化、nullなら0へ
  const scrollPositionCalculated = parseInt(scrollPosition);

  //スクロールする
  goTo(
    scrollPositionCalculated,
    {
    duration: 0,
    container: "#ChannelContainerContent"
    }
  );

  //ロードできたと設定
  stateLoaded.value = true;
});

</script>

<template>
  

  <div style="overflow-y:auto;">

    <div
      style="height:100%; width:100%; overflow-y:auto;"
      class="d-flex py-1 flex-column-reverse"
      id="ChannelContainerContent"
      ref="ChannelContainerContent"
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

      <!-- メッセージ表示 -->
      <div
        v-for="
          (message, index)
            of
          getHistoryFromChannel(props.channelInfo.channelId)
        "
        :key="message.messageId"
        :id="'msg' + message.messageId"
        position="relative"
      >
        <span v-if="index===0" ref="latestMessageAnchor">
          <MessageRender
            :message="message"
            :borderClass="calculateMessageBorder(index)"
          />
        </span>
        <span v-else>
          <MessageRender
            :message="message"
            :borderClass="calculateMessageBorder(index)"
          />
        </span>

      </div>

      <!-- 履歴の先頭だった用の表示 -->
      <v-chip
        v-if="
          getHistoryAvailability(props.channelInfo.channelId).atTop
        "
        class="mx-auto my-4 pa-5"
      >
        履歴はここまで
      </v-chip>

      <!-- 戦闘のロードホルダー -->
      <span
        v-if="!getHistoryAvailability(props.channelInfo.channelId).atTop"
        ref="skeletonLoaderOlder"
      >
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
        <v-skeleton-loader type="list-item-avatar" color="background"></v-skeleton-loader>
      </span>

    </div>

  </div>
</template>

<style scoped>

.messageContainer {
  background-color: rgb(var(--v-theme-code));
  padding: 8px;
}

.messageContainer:hover {
  background-color: rgb(var(--v-theme-messageHovered));
}

.messageTop {
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;

  margin-top: 4px;
}

.messageBottom {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;

  margin-Bottom: 4px;
}

.messageMiddle {
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;

  padding: 2px;
  margin: 0;
}

.messageSingle {
  border-radius: 18px;

  margin: 4px 0;
}
</style>
