<script setup lang="ts">
import { useChannelinfo } from "~/stores/channel";
import { useMyUserinfo } from "~/stores/userinfo";

const { getChannelinfoSingle } = storeToRefs(useChannelinfo());
const { getMyUserinfo } = storeToRefs(useMyUserinfo());

const props = defineProps<{
  channelId: string;
}>();

/**
 * #<123...>からチャンネルIdのみを取り出す
 */
const formatedChannelId = computed(() => {
  return props.channelId.split("#<").join("").split(">")[0];
});

/**
 * チャンネルを移動する
 */
const moveChannel = () => {
  const router = useRouter();
  //参加しているならそのチャンネルへ移動、ないならブラウザへ
  if (getMyUserinfo.value.channelJoined.includes(formatedChannelId.value)) {
    router.push(`/channel/${formatedChannelId.value}`);
  } else {
    router.push("/browser");
  }
};
</script>

<template>
  <span style="display:inline-block;">
    <span
      @click="moveChannel"
      class="px-2 pb-1 d-flex align-center justify-center ChannelIdStringContainer cursor-pointer"
      style="width:fit-content;"
    >
      <v-icon class="mr-1 mt-1" size="x-small">mdi-pound</v-icon>
      <span v-if="getChannelinfoSingle(formatedChannelId).createdBy !== 'xxxxx'">
        {{ getChannelinfoSingle(formatedChannelId).channelName }}
      </span>
      <span v-else class="text-disabled">
        不明なチャンネル
      </span>
    </span>
  </span>
</template>

<style scoped>
.ChannelIdStringContainer {
  border-radius: 99999px;
  background-color: rgba(var(--v-theme-cardInner),0.2);
  font-size:16px;
}
</style>
