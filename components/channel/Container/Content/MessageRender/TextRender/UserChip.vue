<script setup lang="ts">
import { useUserIndex } from '~/stores/userindex';
import { useMyUserinfo } from '~/stores/userinfo';
import Userinfo from '~/components/Userinfo.vue';

const { getUserinfo } = storeToRefs(useUserIndex());
const { getMyUserinfo } = storeToRefs(useMyUserinfo());

const props = defineProps<{
  userId: string
}>();

/**
 * data
 */
const displayUserinfo = ref<boolean>(false); //ユーザーページを表示するかどうか

/**
 * @<123...>から数字のユーザーIdのみを取り出す
 */
const formatedUserId = computed(() => {
  return props.userId.split("@<").join("").split(">")[0];
});
</script>

<template>
  <Userinfo
    v-if="displayUserinfo"
    v-model="displayUserinfo"
    :userId="formatedUserId"
  />
  <span
    @click="()=>{displayUserinfo=true;}"
    class="px-2 py-1 userIdStringContainer cursor-pointer"
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
