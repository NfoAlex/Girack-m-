<script setup lang="ts">
import type { channel } from "~/types/channel";

const props = defineProps<{
  channelInfo: channel
}>();
</script>

<template>
  <m-card>
    {{ props.channelInfo.channelName }}
  </m-card>
</template>
