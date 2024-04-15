<script setup lang="ts">
const props = defineProps<{
  content: string
}>();
</script>

<template>
  <p class="text-medium-emphasis" style="word-break: break-all;">
    {{ props.content }}
  </p>
</template>
