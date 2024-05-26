<script setup lang="ts">
const props = defineProps<{
  userId: string
}>();

/**
 * @<123...>から数字のユーザーIdのみを取り出す
 */
const formatedUserId = computed(() => {
  return props.userId.split("@<").join("").split(">")[0];
});
</script>

<template>
    <span
      class="px-1 py-1 userIdStringContainer"
    >
      @{{ formatedUserId }}
    </span>
</template>

<style scoped>
.userIdStringContainer {
  border-radius: 99999px;
  background-color: rgba(var(--v-theme-cardInner),0.2);
  font-size:12px;
}
</style>
