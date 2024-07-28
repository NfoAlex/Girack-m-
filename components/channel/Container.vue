<script setup lang="ts">
import ChannelContainerContent from "~/components/channel/Container/Content.vue";
import { useChannelinfo } from "~/stores/channel";

//チャンネル情報取得
const { getChannelinfoSingle } = storeToRefs(useChannelinfo());

const route = useRoute();
const router = useRouter();

/**
 * 現在いるチャンネルIdを取得する
 */
const getChannelPath = computed(() => {
	//チャンネルIdをルーターオブジェクトから取得
	const channelId = route.params.id;

	//取得したチャンネルIdがシンプル文字列ならそれを返す
	if (typeof channelId !== "object") {
		return channelId;
	}
	if (channelId === undefined) {
		alert("致命的エラー :: リロードしてください");
		router.push("/");
		return "";
	}
});
</script>

<template>
  <div class="d-flex flex-column" style="width:0">
    <ChannelContainerHeader
      class="flex-shrink-0"
      :channel-info="getChannelinfoSingle(getChannelPath ?? '')"
    />
    <KeepAlive>
      <component
        :is="ChannelContainerContent"
        :channel-info="getChannelinfoSingle(getChannelPath ?? '')"
        class="flex-grow-1"
      />
    </KeepAlive>
    <!--<ChannelContainerContent :channel-info="getChannelinfoSingle(getChannelPath)" class="flex-grow-1" />-->
    <ChannelContainerInput :channel-info="getChannelinfoSingle(getChannelPath ?? '' )" class="flex-shrink-0"/>
  </div>
</template>
