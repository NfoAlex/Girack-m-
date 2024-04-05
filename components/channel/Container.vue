<script setup lang="ts">
import { useChannelinfo } from "~/stores/channel";
import type { channel } from "~/types/channel";

//チャンネル情報取得
//const { getChannelinfoSingle } = storeToRefs(useChannelinfo());
const { getChannelinfoSingle } = useChannelinfo();

const route = useRoute();

/**
 * data
 */
const channelInfo = ref<channel>({
  channelId: "",
  channelName: "",
  createdBy: "",
  description: "",
  isPrivate: false,
  speakableRole: ""
});

onMounted(() => {
  //チャンネルID取得
  const channelId = route.params.id;
  //routeからのチャンネルIDがオブジェクトじゃなければチャンネル情報取得、格納
  if (typeof channelId !== "object") {
    //チャンネル情報取得
    const channelInfoTemp:channel|undefined = getChannelinfoSingle(channelId);
    //取得したものがundefinedじゃなければ格納、そうなら初期化
    if (channelInfoTemp !== undefined) {
      //格納
      channelInfo.value = channelInfoTemp;
    } else {
      //ホルダー...
      channelInfo.value = {
        channelId: "",
        channelName: "",
        createdBy: "",
        description: "",
        isPrivate: false,
        speakableRole: ""
      };
    }
  }
});
</script>

<template>
  <div class="d-flex flex-column" style="width:max-content;">
    <ChannelContainerHeader
      class="flex-shrink-0"
      :channel-info="channelInfo"
    />
    <ChannelContainerContent :channel-info="channelInfo" class="flex-grow-1" />
    <ChannelContainerInput :channel-info="channelInfo" class="flex-shrink-0"/>
  </div>
</template>
