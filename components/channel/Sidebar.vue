<script setup lang="ts">
import { useMyUserinfo } from '~/stores/userinfo';

const { getMyUserinfo } = storeToRefs(useMyUserinfo());

const router = useRouter();
const route = useRoute();

/**
 * data
 */
const currentPath = ref<string>(""); //チャンネルID

onMounted(() => {
  //なぜかpathが配列ならブラウザへ
  if (typeof(route.params.id) !== "object") {
    currentPath.value = route.params.id;
  } else {
    router.push("/browser");
  }
});
</script>

<template>
  <div class="d-flex flex-column">
    <m-card-compact
      v-for="channelId of getMyUserinfo.channelJoined"
      @click="router.push('/channel/' + channelId)"
      :variant="currentPath===channelId?'tonal':'text'"
      :color="currentPath===channelId?'primary':null"
      class="d-flex align-center px-3 py-2 mb-1"
      :ripple="false"
      width="100%"
    >
      <v-icon class="mr-1" size="small">mdi-pound</v-icon>
      <p>{{ channelId }}</p>
    </m-card-compact>
  </div>
</template>
