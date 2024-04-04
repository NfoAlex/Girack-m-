<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';

/**
 * data
 */
const messageInput = ref<string>("");

/**
 * Enterキーの処理
 */
const triggerEnter = () => {
  console.log("/channel/:id :: Input : メッセージ->", messageInput.value);
}
</script>

<template>
  <div>
    <v-text-field
      v-model="messageInput"
      @keydown.enter="triggerEnter"
      variant="solo-filled"
      rounded
    />
  </div>
</template>
