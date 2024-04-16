<script setup lang="ts">
import { useMyUserinfo } from '~/stores/userinfo';
import { useServerinfo } from '~/stores/serverinfo';
import { useChannelinfo } from "~/stores/channel";
import { useHistory } from '~/stores/history';
import { useMessageReadId } from '~/stores/messageReadId';

const { getServerinfo } = storeToRefs(useServerinfo());
const { getMyUserinfo } = storeToRefs(useMyUserinfo());
const { getChannelinfoSingle } = storeToRefs(useChannelinfo());
const { getHistoryFromChannel, getHistoryAvailability } = useHistory();
const { getMessageReadId } = useMessageReadId();

const router = useRouter();
const route = useRoute();

/**
 * data
 */
const currentPath = ref<string>(""); //チャンネルID

/**
 * 最新のメッセージと違うかどうか
 */
const IsItNew = (channelId: string) => {
  //そもそも履歴の最後を持っていないなら新着
  if (!getHistoryAvailability(channelId).atEnd) {
    return true;
  }
  //最新メッセージのメッセIDと最新既読Idが違うならこれは新着
  if (getHistoryFromChannel(channelId)[0].messageId !== getMessageReadId(channelId)) {
    return true
  }

  return false;
}

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
      <p>{{ getChannelinfoSingle(channelId)?.channelName }}</p>
      <v-icon v-if="IsItNew(channelId)" class="ml-auto">mdi-circle-medium</v-icon>
    </m-card-compact>
  </div>
</template>
