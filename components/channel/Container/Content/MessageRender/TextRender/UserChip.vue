<script setup lang="ts">
const props = defineProps<{
  userId: string
}>();
</script>

<template>
    <span
      class="px-1 py-1 userIdStringContainer"
    >
      @{{ props.userId }}
    </span>
</template>

<style scoped>
.userIdStringContainer {
  border-radius: 99999px;
  background-color: rgba(var(--v-theme-cardInner),0.2);
  font-size:12px;
}
</style>
