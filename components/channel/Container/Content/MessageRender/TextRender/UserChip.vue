<script setup lang="ts">
import { useUserIndex } from '~/stores/userindex';
import { useMyUserinfo } from '~/stores/userinfo';

const { getUserinfo } = storeToRefs(useUserIndex());
const { getMyUserinfo } = storeToRefs(useMyUserinfo());

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
      class="px-2 py-1 userIdStringContainer"
      :class="formatedUserId===getMyUserinfo.userId ? 'userIdMentioningMe':null"
    >
      @{{ getUserinfo(formatedUserId).userName }}
    </span>
</template>

<style scoped>
.userIdStringContainer {
  border-radius: 99999px;
  background-color: rgba(var(--v-theme-cardInner),0.2);
  font-size:12px;
}

.userIdMentioningMe {
  background-color: rgba(var(--v-theme-warning),0.2);
}
</style>
