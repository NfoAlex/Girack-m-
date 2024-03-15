<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import type { MyUserinfo } from '~/types/user';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

const props = defineProps<{
  userId: string
}>();

/**
 * data
 */
const Userinfo = ref<MyUserinfo>({
  userName: '',
  role: [],
  userId: '',
  banned: false,
  channelJoined: []
});

/**
 * ユーザー情報受け取り
 * @param dat
 */
const SOCKETfetchUserInfo = (dat:{result:string, data:MyUserinfo}) => {
  console.log("Userinfo :: SOCKETfetchUserInfo : dat->", dat);

  //ユーザー情報を格納
  Userinfo.value = dat.data;
};

onMounted(() => {
  socket.on("RESULT::fetchUserInfo", SOCKETfetchUserInfo);

  //console.log("Userinfo :: onMounted : マウントされた");

  //ユーザー情報取得
  socket.emit("fetchUserInfo", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    userId: props.userId
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchUserInfo", SOCKETfetchUserInfo);
});

</script>

<template>
  <v-dialog>
    <m-card>
      {{ props.userId }}
      <v-divider />
      {{ Userinfo }}
    </m-card>
  </v-dialog>
</template>
