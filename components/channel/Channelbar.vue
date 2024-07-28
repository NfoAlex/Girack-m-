<script setup lang="ts">
import draggable from "vuedraggable";
import { socket } from "~/socketHandlers/socketInit";
import { useChannelinfo } from "~/stores/channel";
import { useHistory } from "~/stores/history";
import { useInbox } from "~/stores/inbox";
import { useMessageReadTime } from "~/stores/messageReadTime";
import { useServerinfo } from "~/stores/serverinfo";
import { useMyUserinfo } from "~/stores/userinfo";

import type { channel, channelOrder } from "~/types/channel";

const { getServerinfo } = storeToRefs(useServerinfo());
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getChannelinfoSingle } = storeToRefs(useChannelinfo());
const { getChannelOrder } = storeToRefs(useChannelinfo());
const { getMentionNumOnChannel } = storeToRefs(useInbox());
const { updateChannelOrder } = useChannelinfo();
const { getLatestMessage, getHasNewMessage } = storeToRefs(useHistory());
const { setHasNewMessage } = useHistory();
const { getMessageReadTime } = storeToRefs(useMessageReadTime());

const router = useRouter();
const route = useRoute();

/**
 * data
 */
const currentPath = ref<string>(""); //チャンネルID
const channelOrderedData = ref<channel[]>([]);

/**
 * チャンネルリストを保存した順序へ補完しつつソートして表示に使う格納する
 */
const getChannelListOrdered = () => {
  //チャンネル順序結果用配列
  let channelOrderPushing: channelOrder[] = [];

  //console.log('Channelbar :: getChannelListOrdered : getChannelOrder->', toRaw(getChannelOrder.value));

  //まず保存されているチャンネル順序配列をプッシュ
  try {
    channelOrderPushing = [...toRaw(getChannelOrder.value)];
  } catch (e) {}

  //保存されていない順序データに無かったチャンネルId用配列
  const channelNotUsed = [];

  //順序に保存されていないチャンネルを調べる
  for (const channelIdChecking of getMyUserinfo.value.channelJoined) {
    //チャンネルがすでに順序データに入っているかどうかフラグ
    let thisChannelIsIncluded = false;
    //ループで一致したものを探す
    for (const index in getChannelOrder.value) {
      if (getChannelOrder.value[index].channelId === channelIdChecking) {
        thisChannelIsIncluded = true;
        break;
      }
    }

    //フラグが無効なら使われていないチャンネルリストへ追加
    if (!thisChannelIsIncluded) channelNotUsed.push(channelIdChecking);
  }

  //入ってなかった配列分プッシュ
  for (const channelId of channelNotUsed) {
    channelOrderPushing.push({
      channelId: channelId,
      isThread: false,
      isFolder: false,
    });
  }

  //結果を適用
  channelOrderedData.value = [
    ...channelOrderedData.value,
    ...channelOrderPushing,
  ];
};

//チャンネルボタン用配列処理
onBeforeMount(() => {
  getChannelListOrdered();
});

onMounted(() => {
  //なぜかpathが配列ならブラウザへ
  if (typeof route.params.id !== "object") {
    currentPath.value = route.params.id;
  } else {
    router.push("/browser");
  }

  //チャンネル順序のソートを検知してサーバー上へ同期させる
  watch(channelOrderedData, (newValue, oldValue) => {
    //console.log("Channelbar :: watch(channelOrderData) : newValue->", newValue);

    //チャンネル情報用Storeのチャンネル順序を更新させる
    updateChannelOrder(newValue);

    socket.emit("saveUserChannelOrder", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value,
      },
      channelOrder: newValue,
    });
  });
});
</script>

<template>
  <div class="d-flex flex-column">
    <p class="mt-2 text-h5 text-truncate">{{ getServerinfo.servername }}</p>
    <v-divider class="my-2" />

    <span>
      <draggable
        v-model="channelOrderedData"
        item-key="channelId"
      >
        <template #item="{ element }">
          <m-card-compact
            @click="router.push('/channel/' + element.channelId)"
            :variant="currentPath===element.channelId?'tonal':'text'"
            :color="currentPath===element.channelId?'primary':null"
            :ripple="false"
            class="d-flex align-center px-3 py-2 mb-1"
          >
            <v-icon class="mr-1" size="small">mdi-pound</v-icon>
            <p class="flex-shrink-1 text-truncate">
              {{ getChannelinfoSingle(element.channelId).channelName }}
            </p>
            
            <v-icon
              v-if="
                getHasNewMessage(element.channelId)
                &&
                getMentionNumOnChannel(element.channelId) === 0
              "
              class="ml-auto flex-shrink-0"
            >
              mdi-circle-medium
            </v-icon>
            <v-badge
              v-if="getMentionNumOnChannel(element.channelId) !== 0"
              class="ml-auto flex-shrink-0"
              :content="getMentionNumOnChannel(element.channelId)"
              color="error"
              inline
            >
            </v-badge>
          </m-card-compact>
        </template>
      </draggable>
    </span>
    
  </div>
</template>
