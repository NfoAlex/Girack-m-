<script setup lang="ts">
import UserChip from './MessageRender/TextRender/UserChip.vue';
import type { ISystemMessageContent, ISystemMessageFlag } from '~/types/message';

const props = defineProps<{
  content: string;
}>();

//システムメッセージ文表示用
const flagDictionary = new Map<ISystemMessageFlag, string>([
  ["CHANNEL_JOINED", "がチャンネルへ参加しました!"],
  ["SERVER_JOINED", "がサーバーへ参加しました!"],
]);

/**
 * data
 */
const systemMessageJson = ref<ISystemMessageContent>({
  flag: 'SERVER_JOINED',
  targetUserId: null,
  senderUserId: ''
});

onMounted(() => {
  try {
    //パースして格納してみる
    systemMessageJson.value = JSON.parse(props.content);
  } catch(e) {}
});

</script>

<template>
  <div
    v-if="systemMessageJson.senderUserId !== ''"
    class="d-flex align-center justify-center text-medium-emphasis mx-auto my-3"
    style="width:100%;"
  >
    <UserChip :userId="systemMessageJson.senderUserId" class="mr-1" />
    <p>{{ flagDictionary.get(systemMessageJson.flag) }}</p>
  </div>
</template>