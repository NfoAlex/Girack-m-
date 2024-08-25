<script setup lang="ts">
import type { ISystemMessageContent } from '~/types/message';

const props = defineProps<{
  content: string;
}>();

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
  <div>
    {{ JSON.stringify(systemMessageJson) }}
  </div>
</template>