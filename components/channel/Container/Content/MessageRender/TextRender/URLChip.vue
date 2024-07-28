<script setup lang="ts">
const props = defineProps<{
  url: string;
}>();
</script>

<template>
  <a :href="props.url" rel="noopener noreferrer" target="_blank">
    <span
      class="py-1 urlStringContainer"
    >
      {{ props.url }}
    </span>
  </a>
</template>

<style scoped>
.urlStringContainer {
  border-radius: 99999px;
  color: rgba(var(--v-theme-primary),0.9);
  font-size: 14px;
}
</style>
