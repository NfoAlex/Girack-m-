<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import { useRole } from '~/stores/role';

const { getRoleSingle } = storeToRefs(useRole());

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
  <v-dialog width="85vw" max-width="800px">
    <m-card style="width:100%; height:100%;">
      {{ Userinfo }}
      <v-divider />
      <div class="d-flex">
        <v-avatar class="mr-3">
          {{ Userinfo.userName }}
        </v-avatar>
        <span>
          <p class="text-disabled text-caption">#{{ Userinfo.userId }}</p>
          <p class="text-h5">
            {{ Userinfo.userName }}
          </p>
        </span>
      </div>

      <div class="d-flex my-1">
        <v-chip v-for="roleId of Userinfo.role" size="small">
          <v-icon
            :color="getRoleSingle(roleId).color"
            class="mr-2"
          >mdi-circle</v-icon>
          {{ getRoleSingle(roleId).name }}
        </v-chip>
      </div>

      <m-card color="surface">
        <p>参加チャンネル</p>
        {{ Userinfo.channelJoined }}
      </m-card>
    </m-card>
  </v-dialog>
</template>
