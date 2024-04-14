<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';

//props(リアクション)
const props = defineProps<{
  reaction: {
    [key: string]: {
      [key: string]: number
    }
  }
}>();
</script>

<template>
  <span>ここが絵文字 : {{ props.reaction }}</span>
</template>
