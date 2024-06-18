<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
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
const { y, arrivedState } = useScroll(ChannelContainerContent)
//ウィンドウのフォーカス取得用
const windowFocused = useWindowFocus();

//Storeデータ用
const { getAppStatus } = storeToRefs(useAppStatus());
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getHistoryFromChannel, getHistoryAvailability, setHasNewMessage } = useHistory();
const { getMessageReadId, updateMessageReadIdBefore } = useMessageReadId();

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

  //履歴を取得中であるとグローバルで設定
  getAppStatus.value.fetchingHistory = true;

  //履歴を取得
  socket.emit("fetchHistory", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: props.channelInfo.channelId,
    fetchingPosition: {
      positionMessageId: oldestMessageId,
      includeThisPosition: false,
      fetchDirection: "older"
    }
  });

  /*
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
  */
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

  //履歴を取得中であるとグローバルで設定
  getAppStatus.value.fetchingHistory = true;

  //履歴を取得
  socket.emit("fetchHistory", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    channelId: props.channelInfo.channelId,
    fetchingPosition: {
      positionMessageId: newestMessageId,
      includeThisPosition: false,
      fetchDirection: "newer"
    }
  });

  /*
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
  */
}

/**
 * 前後のメッセージからの時差が5分以上あるか計算
 * @param messageIndex
 */
const calculateTimeDiff = (messageIndex:number) => {
  try {
    //メッセージの前後を取得
    const messageAvailable = {
      next: getHistoryFromChannel(props.channelInfo.channelId)[messageIndex + 1] || null,
      here: getHistoryFromChannel(props.channelInfo.channelId)[messageIndex],
      before: getHistoryFromChannel(props.channelInfo.channelId)[messageIndex - 1] || null,
    };

    const result = {
      next: false,
      before: false
    };

    if (messageAvailable.before !== null) {
      if (
        (
          new Date(messageAvailable.before.time).valueOf() - new Date(messageAvailable.here.time).valueOf()
        ) / 1000 / 60
          >
        5
      ) {
        //console.log("時差 -> ", (new Date(messageAvailable.before.time).valueOf() - new Date(messageAvailable.here.time).valueOf()) / 1000 / 60);

        result.before = true;
      }
    }

    if (messageAvailable.next !== null) {
      if (
        (
          new Date(messageAvailable.here.time).valueOf() - new Date(messageAvailable.next.time).valueOf()
        ) / 1000 / 60
          >
        5
      ) {
        //console.log("時差 -> ", (new Date(messageAvailable.before.time).valueOf() - new Date(messageAvailable.here.time).valueOf()) / 1000 / 60);

        result.next = true;
      }
    }

    return result;

  } catch (e) {
    return {
      next: false,
      before: false
    };
  }

};

/**
 * 前のメッセージと日付が違うかどうか
 * @param messageIndex
 */
const calculateDateDiffFromNext = (messageIndex:number) => {
  try {
    //メッセージの前後を取得
    const messageAvailable = {
      next: getHistoryFromChannel(props.channelInfo.channelId)[messageIndex + 1] || null,
      here: getHistoryFromChannel(props.channelInfo.channelId)[messageIndex]
    };

    //ひとつ前のメッセージがnullじゃないなら計算、nullなら日付線を表示させる
    if (messageAvailable.next !== null) {
      if (
        new Date(messageAvailable.here.time).getDate()
          !==
        new Date(messageAvailable.next.time).getDate()
      ) {

        return true;
      }
    } else {
      return true;
    }
  } catch (e) {
    return false;
  }
};

/**
 * メッセージ枠のスタイル計算用
 * @param messageIndex
 */
const calculateMessageBorder = (messageIndex:number) => {
  //メッセージの前後を取得
  const messageAvailable = {
    next: getHistoryFromChannel(props.channelInfo.channelId)[messageIndex + 1] || null,
    here: getHistoryFromChannel(props.channelInfo.channelId)[messageIndex],
    before: getHistoryFromChannel(props.channelInfo.channelId)[messageIndex - 1] || null,
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
      //時差計算
      const timeDiffs = calculateTimeDiff(messageIndex);
      return timeDiffs.next ? "messageSingle" : "messageBottom";
    }
  } else if (messageAvailable.next === null) { //最初でなく、次のメッセージがなければ(最後)
    //次(下)のメッセージと送信者が同じなら
    if (messageAvailable.before.userId === messageAvailable.here.userId) {
      //時差計算
      const timeDiffs = calculateTimeDiff(messageIndex);
      
      return timeDiffs.before ? "messageSingle" : "messageTop";
    } else { //違うなら
      return "messageSingle";
    }
  } else { //最初でも最後のメッセージでもないなら
    //前のメッセージと同じ送信者で
    if (messageAvailable.next.userId === messageAvailable.here.userId) {

      //かつ次のメッセージとも同じなら
      if (messageAvailable.before.userId === messageAvailable.here.userId) {
        //時差計算
        const timeDiffs = calculateTimeDiff(messageIndex);
        //ひとつ前から時差があるなら
        if (timeDiffs.next && timeDiffs.before) {
          return "messageSingle";
        } else if (timeDiffs.next) {
          return "messageTop";
        } else if (timeDiffs.before) {
          return "messageBottom";
        }
        return "messageMiddle";
      } else {
        //時差計算
        const timeDiffs = calculateTimeDiff(messageIndex);
        return timeDiffs.next ? "messageSingle" : "messageBottom";
      }

    } else { //前のメッセージが違う送信者

      //次のメッセージが同じ送信者なら
      if (messageAvailable.before.userId === messageAvailable.here.userId) {
        //時差計算
        const timeDiffs = calculateTimeDiff(messageIndex);
        //一つ後から時差があるなら
        if (timeDiffs.before) {
          return "messageSingle";
        }
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
    setTimeout(fetchOlderHistory, 10);
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
    setTimeout(fetchNewerHistory, 10);
  }
});

//最新のメッセージにいるかどうか
watch(atLatestMessage, function (newValue, oldValue) {
  //console.log("/channel/:id :: watch(atLatestMessage) : 最新にいそうだな->", newValue);

  //最新メッセから離れたときを除く
  if (newValue) {
    //表示している内の最新のメッセージIDを取得
    const latestMessageId = getHistoryFromChannel(props.channelInfo.channelId)[0].messageId

    //もし履歴の最後にいるなら更新処理
    if (getHistoryAvailability(props.channelInfo.channelId).atEnd) {
      //新着があるという状態を解除
      setHasNewMessage(props.channelInfo.channelId, false);
      //最新既読Idを更新
      updateMessageReadIdCloudAndLocal(props.channelInfo.channelId, latestMessageId);
    }
  }
});

// *************  履歴監視の取得状態監視  ************* //
//履歴の更新を監視
watch(
  getAppStatus,
  (newValue, oldValue) => {
    nextTick(() => {
      //console.log("/channel/:id :: watch(getHistory...) : 変更された?", newValue, oldValue);

      //履歴を取り終えたとき、履歴を取得した位置からスクロールする
      if (displayDirection.value === "newer" && !newValue.fetchingHistory) {
        //console.log("/channe/[id] :: watch(getAppStatus) : 最後->", getHistoryAvailability(props.channelInfo.channelId).atEnd);
        try {
          //履歴追加をし始めたメッセージId
          const messageScrolledPosition = getHistoryFromChannel(
              props.channelInfo.channelId
            )[
              getHistoryAvailability(props.channelInfo.channelId).latestFetchedHistoryLength - 1
            ].messageId;

          // console.log("/channel/[id] :: watch(getAppStatus) : 要素->",
          //   document.getElementById("msg" + messageScrolledPosition),
          // );

          //その要素へスクロールする
            //要素DOMオブジェクト取得
          const el = document.getElementById("msg" + messageScrolledPosition);
            //要素がnullじゃないならその要素へスクロール
          if (el !== null) {
            document.getElementById("ChannelContainerContent")?.scrollTo({
              top: el.getBoundingClientRect().top
            });
          }

          //履歴取得時一番下なら新着削除
          if (y.value === 0) {
            setHasNewMessage(props.channelInfo.channelId, false);
            //表示している内の最新のメッセージIDを取得
            const latestMessageId = getHistoryFromChannel(props.channelInfo.channelId)[0].messageId
            //最新既読Idを更新
            updateMessageReadIdCloudAndLocal(props.channelInfo.channelId, latestMessageId);
          }
        } catch(e) {
          //なにもしない
          console.log("/channel/[id] :: watch(getAppStatus) : エラー->", e);
        }
      }
      
      //上方向での処理
      if (displayDirection.value === "older" && !newValue.fetchingHistory) {
        //履歴を取得できた時に一番下にいるなら再度取得
        if (arrivedState.top) {
          fetchOlderHistory();
        }
      }

    });
  },
  {deep: true}
);

// *************  ウィンドウフォーカス  ************* //
//フォーカスしたとき、一番下にいるのなら最新既読Idを更新
watch(windowFocused, (newValue, oldValue) => {
  if (
    newValue
      &&
    y.value === 0
      &&
    getHistoryAvailability(props.channelInfo.channelId).atEnd
  ) {
    //新着状態を消す
    setHasNewMessage(props.channelInfo.channelId, false);
    //最新メッセIDを取得
    const latestMessageId = getHistoryFromChannel(props.channelInfo.channelId)[0].messageId;
    //Storeとサーバーで同期
    updateMessageReadIdCloudAndLocal(props.channelInfo.channelId, latestMessageId);
  }
});

onMounted(() => {
  console.log("/channel/[id] :: マウントされた？");
  //ロード状態を解除
  stateLoaded.value = false;

  //最後にいたチャンネルId抽出
  let latestChannelId = props.channelInfo.channelId;

  //console.log("/channel/[id] :: onMounted : 最後にいたチャンネル->", latestChannelId);

  nextTick(() => {

    //スクロール位置を取り出し
    const scrollPosition = sessionStorage.getItem(
      "scrollPositionY::" + props.channelInfo.channelId
    );
    //console.log("/channel/[id] :: onMounted : スクロール記憶位置->", scrollPosition);

    //最新既読Idの要素を取得
    const latestReadEl = document.getElementById("msg" + getMessageReadId(props.channelInfo.channelId));

    //最新既読Idへスクロール、ないなら一番古いやつへ
    if (
      scrollPosition !== null
    ) {
      //console.log("scrolling to ...->", scrollPositionCalculated);
      //VuetifyのgoToだと数値での移動ができないためscrollTo
      console.log("/channel/[id] :: onMounted : (記憶位置)スクロールします->", scrollPosition);
      document.getElementById("ChannelContainerContent")?.scrollTo({
        top: parseInt(scrollPosition)
      });
    } else if (latestReadEl !== null) {
      console.log("/channel/[id] :: onMounted : (最新既読Id)スクロールします->", scrollPosition);
      //最新既読Idへ
      document.getElementById("ChannelContainerContent")?.scrollTo({
        top: latestReadEl.getBoundingClientRect().top
      });
    }

    /*
    console.log("Content :: onMounted : props.channelInfo.channelId->",
      props.channelInfo.channelId,
      " atEnd->",
      getHistoryAvailability(props.channelInfo.channelId).atEnd,
      " y.value->", y.value
    );
    */

    //もし履歴の最後にいるなら新着を消す
    if (
      getHistoryAvailability(props.channelInfo.channelId).atEnd
      &&
      y.value === 0
    ) {
      console.log("Content :: onMounted : 既読に設定する、同期も", props.channelInfo.channelName);
      //新着削除
      setHasNewMessage(props.channelInfo.channelId, false);
      //表示している内の最新のメッセージIDを取得
      const latestMessageId = getHistoryFromChannel(props.channelInfo.channelId)[0].messageId
      //最新既読Idを更新
      updateMessageReadIdCloudAndLocal(props.channelInfo.channelId, latestMessageId);
    }

    //移動前のチャンネル用の最新既読IdBeforeを更新
    const channelBefore = sessionStorage.getItem("latestChannel");
    if (channelBefore !== null) {
      updateMessageReadIdBefore(channelBefore);
    }

    //ロードできたと設定
    stateLoaded.value = true;

  });
});

//別のチャンネルへ移動する前に最後にいたチャンネルIdとスクロール位置を記録
onBeforeUnmount(() => {
  sessionStorage.setItem('latestChannel', props.channelInfo.channelId);
  sessionStorage.setItem('scrollPositionY::'+props.channelInfo.channelId, y.value.toString());

  //DEBUG :: スクロール位置を取り出し
  /*
  const scrollPosition = sessionStorage.getItem(
    "scrollPositionY::" + props.channelInfo.channelId
  );
  console.log("/channel/[id] :: onBeforeUnmount : スクロール記憶位置->", scrollPosition);
  console.log("=========================================================");
  */
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
        class="d-flex flex-column"
      >

        <!-- 日付が違うとき用線 -->
        <div v-if="calculateDateDiffFromNext(index)" class="d-flex flex-row align-center">
          <v-divider class="flex-shrink-1" :thickness="3" />
          <p class="flex-grow-1 flex-shrink-0 mx-3">{{ new Date(message.time).toLocaleDateString() }}</p>
          <v-divider class="flex-shrink-1" :thickness="3" />
        </div>

        <span v-if="index===0" ref="latestMessageAnchor">
          <MessageRender
            :message="message"
            :index
            :borderClass="calculateMessageBorder(index)"
          />
        </span>
        <span v-else>
          <MessageRender
            :message="message"
            :index
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
