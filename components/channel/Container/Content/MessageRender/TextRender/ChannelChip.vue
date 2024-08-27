<script setup lang="ts">
import { useChannelinfo } from "~/stores/channel";

const { getChannelinfoSingle } = storeToRefs(useChannelinfo());

const props = defineProps<{
  channelId: string;
}>();

/**
 * @<123...>から数字のユーザーIdのみを取り出す
 */
const formatedChannelId = computed(() => {
  return props.channelId.split("#<").join("").split(">")[0];
});
</script>

<template>
  <span>
    <span
      class="px-2 pb-1 d-flex align-center justify-center ChannelIdStringContainer cursor-pointer"
      style="width:fit-content;"
    >
      <span>#</span>
      <span>
      </span>
      <span>{{ getChannelinfoSingle(formatedChannelId).channelName }}</span>
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
