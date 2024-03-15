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
const displayPage = ref<"joinedChannel"|"manage"|"JSON">("joinedChannel");

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
  <v-dialog width="65vw" max-width="800px" height="75vh" max-height="900px">
    <m-card style="height:100%;">
      <div
        class="d-flex align-center my-3 text-truncate"
        style="width:100%;"
      >
        <v-avatar class="mr-3" size="84">
          {{ Userinfo.userName }}
        </v-avatar>
        <div class="text-truncate">
          <p class="text-disabled text-caption">#{{ Userinfo.userId }}</p>
          <p class="text-h4 text-truncate">
            {{ Userinfo.userName }}
          </p>
          <div class="my-1 d-flex" style="flex-wrap: wrap">
            <RoleChip
              v-for="roleId of Userinfo.role"
              :roleId="roleId"
              :userId="Userinfo.userId"
            />
            <RoleAdd :userId="props.userId" />
          </div>
        </div>
      </div>

      <span class="d-flex">
        <m-btn
          @click="displayPage = 'joinedChannel'"
          :variant="displayPage==='joinedChannel'?'tonal':'text'"
        >
          <v-icon>mdi:mdi-pound</v-icon>
          参加チャンネル
        </m-btn>
        <m-btn
          @click="displayPage = 'manage'"
          :variant="displayPage==='manage'?'tonal':'text'"
        >
          <v-icon>mdi:mdi-shield-account</v-icon>
          管理
        </m-btn>
        <m-btn
          @click="displayPage = 'JSON'"
          :variant="displayPage==='JSON'?'tonal':'text'"
          color="orange"
        >
          <v-icon>mdi:mdi-bug</v-icon>
          JSON
        </m-btn>
      </span>

      <m-card v-if="displayPage==='joinedChannel'" color="surface" class="mt-2">
        <p>参加チャンネル</p>
        {{ Userinfo.channelJoined }}
      </m-card>

      <m-card v-if="displayPage==='manage'" color="surface" class="mt-2">
        <p>ToDo :: ここで管理</p>
      </m-card>

      <m-card v-if="displayPage==='JSON'" color="surface" class="mt-2">
        {{ Userinfo }}
      </m-card>
    </m-card>
  </v-dialog>
</template>
