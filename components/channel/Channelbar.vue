<script setup lang="ts">
import { useMyUserinfo } from '~/stores/userinfo';
import { useServerinfo } from '~/stores/serverinfo';
import { useChannelinfo } from "~/stores/channel";
import { useHistory } from '~/stores/history';

import draggable from 'vuedraggable';

const { getServerinfo } = storeToRefs(useServerinfo());
const { getMyUserinfo } = storeToRefs(useMyUserinfo());
const { getChannelinfoSingle } = storeToRefs(useChannelinfo());
const { getChannelOrder } = storeToRefs(useChannelinfo());
const { getHasNewMessage } = useHistory();

const router = useRouter();
const route = useRoute();

/**
 * data
 */
const currentPath = ref<string>(""); //チャンネルID
const channelOrderedData =ref<any[]>([]);

/**
 * チャンネルリストを保存した順序にソートして返す
 */
const getChannelListOrdered = () => {
  //チャンネル順序結果用配列
  let channelOrderPushing:any[] = [];

  //console.log('Channelbar :: getChannelListOrdered : getChannelOrder->', toRaw(getChannelOrder.value));

  //まず保存されているチャンネル順序配列をプッシュ
  try {
    channelOrderPushing = [...toRaw(getChannelOrder.value)];
  } catch(e) {}

  //保存されていない順序データに無かったチャンネルId用配列
  const channelNotUsed = [];

  //順序に保存されていないチャンネルを調べる
  for (let channelIdChecking of getMyUserinfo.value.channelJoined) {
    //チャンネルがすでに順序データに入っているかどうかフラグ
    let thisChannelIsIncluded = false;
    //ループで一致したものを探す
    for (let index in getChannelOrder.value) {
      if (getChannelOrder.value[index].channelId === channelIdChecking) {
        thisChannelIsIncluded = true;
        break;
      }
    }

    //フラグが無効なら使われていないチャンネルリストへ追加
    if (!thisChannelIsIncluded) channelNotUsed.push(channelIdChecking);
  }

  //入ってなかった配列分プッシュ
  for (let channelId of channelNotUsed) {
    channelOrderPushing.push({
      channelId: channelId,
      isThread: false
    });
  }

  //結果を適用
  channelOrderedData.value = [...channelOrderedData.value, ...channelOrderPushing];
};

//チャンネルボタン用配列処理
onBeforeMount(() => {
  getChannelListOrdered();
})

onMounted(() => {
  //なぜかpathが配列ならブラウザへ
  if (typeof(route.params.id) !== "object") {
    currentPath.value = route.params.id;
  } else {
    router.push("/browser");
  }
});
</script>

<template>
  <div class="d-flex flex-column">
    <p class="mt-2 text-h5 text-truncate">{{ getServerinfo.servername }}</p>
    <v-divider class="my-2" />
    <m-card-compact
      v-for="channelId of getMyUserinfo.channelJoined"
      @click="router.push('/channel/' + channelId)"
      :variant="currentPath===channelId?'tonal':'text'"
      :color="currentPath===channelId?'primary':null"
      class="d-flex align-center px-3 py-2 mb-1"
      :ripple="false"
      width="100%"
    >
      <v-icon class="mr-1" size="small">mdi-pound</v-icon>
      <p class="flex-shrink-1 text-truncate">{{ getChannelinfoSingle(channelId)?.channelName }}</p>
      <v-icon
        v-if="getHasNewMessage(channelId)"
        class="ml-auto flex-shrink-0"
      >
        mdi-circle-medium
      </v-icon>
    </m-card-compact>
    <v-divider />
    <span>
      <p>ここからDEBUG</p>
      <draggable
        :list="channelOrderedData"
        item-key="channelId"
      >
        <template #item="{ element }">
          <m-card-compact
            :variant="currentPath===element.channelId?'tonal':'text'"
            :color="currentPath===element.channelId?'primary':null"
            class="d-flex align-center px-3 py-2 mb-1"
          >
            {{ getChannelinfoSingle(element.channelId).channelName }}
          </m-card-compact>
        </template>
      </draggable>
    </span>
  </div>
</template>
