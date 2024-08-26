<script setup lang="ts">
import type {
  ISystemMessageContent,
  ISystemMessageFlag,
} from "~/types/message";
import UserChip from "./MessageRender/TextRender/UserChip.vue";

const props = defineProps<{
  content: string;
}>();

//システムメッセージ文表示用
const flagDictionary = new Map<ISystemMessageFlag, string>([
  ["CHANNEL_JOINED", "がチャンネルへ参加しました!"],
  ["CHANNEL_INVITED", "がチャンネルへ招待されました"],
  ["CHANNEL_LEFT", "がチャンネルから退出しました。"],
  ["CHANNEL_INFO_UPDATED", "がチャンネル情報を更新しました。"],
  ["CHANNEL_KICKED", "がチャンネルからキックされました。"],
  ["SERVER_JOINED", "がサーバーへ参加しました!"],
  ["SERVER_UPDATED", "がサーバー情報を更新しました。"],
]);

/**
 * data
 */
const systemMessageJson = ref<ISystemMessageContent>({
  flag: "SERVER_JOINED",
  targetUserId: null,
  senderUserId: "",
});

onMounted(() => {
  try {
    //パースして格納してみる
    systemMessageJson.value = JSON.parse(props.content);
  } catch (e) {}
});
</script>

<template>
  <div
    v-if="systemMessageJson.senderUserId !== ''"
    class="d-flex align-center justify-center text-medium-emphasis mx-auto my-1"
    style="width:100%;"
  >
    <UserChip :userId="systemMessageJson.senderUserId" style="min-width:25%" class="mr-1 text-truncate flex-shrink-0" />
    <p class="text-truncate">{{ flagDictionary.get(systemMessageJson.flag) }}</p>
  </div>
</template>