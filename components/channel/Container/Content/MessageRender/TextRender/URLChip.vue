<script setup lang="ts">
const props = defineProps<{
  url: string
}>();
</script>

<template>
  <a :href="props.url" rel="noopener noreferrer" target="_blank">
    <v-chip size="small" color="primary">
      {{ props.url }}
    </v-chip>
  </a>
</template>
