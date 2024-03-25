<script setup lang="ts">
import { useMyUserinfo } from '~/stores/userinfo';

const { getMyUserinfo } = storeToRefs(useMyUserinfo());
const router = useRouter();

onMounted(() => {
  //自分の参加チャンネル
  const channelJoined:string[] = getMyUserinfo.value.channelJoined;
  //最初のチャンネルへ移動
  if (channelJoined.length !== 0) {
    router.push("/channel/" + channelJoined[0]);
  } else {
    router.push("/browser");
  }
});

</script>
<template>ここチャンネルトップ</template>
