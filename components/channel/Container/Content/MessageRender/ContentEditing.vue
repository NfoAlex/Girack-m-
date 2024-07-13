<script setup lang="ts">

const emits = defineEmits<{(e: 'leaveEditing'): void}>();

const propsMessage = defineProps<{
  content: string,
}>();
</script>

<template>
  <div>
    <p>ここで編集する</p>
    <span>{{ propsMessage.content }}</span>
    <v-btn @click="emits('leaveEditing')">戻る</v-btn>
  </div>
</template>