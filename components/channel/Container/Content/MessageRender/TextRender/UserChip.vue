<script setup lang="ts">
import Userinfo from "~/components/Userinfo.vue";
import { useUserIndex } from "~/stores/userindex";
import { useMyUserinfo } from "~/stores/userinfo";

const { getUserinfo } = storeToRefs(useUserIndex());
const { getMyUserinfo } = storeToRefs(useMyUserinfo());

const props = defineProps<{
  userId: string;
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
  <span style="display: inline-block;">
    <Userinfo
      v-if="displayUserinfo"
      v-model="displayUserinfo"
      :userId="formatedUserId"
    />
    <span
      @click="()=>{displayUserinfo=true;}"
      class="px-2 pb-1 d-flex align-center justify-center userIdStringContainer cursor-pointer"
      :class="formatedUserId===getMyUserinfo.userId ? 'userIdMentioningMe':null"
      style="width:fit-content;"
    >
      <span>@</span>
      <span>
        <v-avatar v-bind="props" size="16" class="mx-1 mb-0">
          <v-img
            :src="'/icon/' + formatedUserId"
          ></v-img>
        </v-avatar>
      </span>
      <span>{{ getUserinfo(formatedUserId).userName }}</span>
    </span>
  </span>
</template>

<style scoped>
.userIdStringContainer {
  border-radius: 99999px;
  background-color: rgba(var(--v-theme-cardInner),0.2);
  font-size:16px;
}

.userIdMentioningMe {
  background-color: rgba(var(--v-theme-warning),0.2);
}
</style>
