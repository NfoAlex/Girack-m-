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
 * ユーザーをBANする
 */
const banUser = () => {
  socket.emit("banUser", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    targetUserId: props.userId
  });
};

/**
 * ユーザーのBANを解除する
 */
const pardonUser = () => {
  socket.emit("pardonUser", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    targetUserId: props.userId
  });
};

/**
 * ユーザー情報受け取り
 * @param dat
 */
const SOCKETfetchUserInfo = (dat:{result:string, data:MyUserinfo}) => {
  //console.log("Userinfo :: SOCKETfetchUserInfo : dat->", dat);

  //ユーザー情報を格納
  Userinfo.value = dat.data;
};

onMounted(() => {
  socket.on("RESULT::fetchUserInfo", SOCKETfetchUserInfo);

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
  <v-dialog width="50vw" max-width="600px" height="55vh" max-height="750px">
    <m-card class="d-flex flex-column" style="height:100%; padding: 0 !important;">
      <v-alert
        v-if="Userinfo.banned"
        class="mx-auto flex-shrink-0 flex-grow-0 py-8 mt-5 d-flex align-center"
        color="error"
        width="95%"
      >
        <v-icon class="mx-1">mdi-lock</v-icon>
        <span>このユーザーはBANされています。</span>
      </v-alert>
      
      <div
        class="d-flex flex-column align-center mt-3 pa-5 text-truncate"
        style="width:100%;"
      >
        <v-avatar size="104">
          <v-img :src="'/icon/' + Userinfo.userId" :alt="Userinfo.userId">
          </v-img>
        </v-avatar>
        <div class="text-truncate mt-2 text-center">
          <p class="text-disabled text-caption">#{{ Userinfo.userId }}</p>
          <p class="text-h4 text-truncate">
            {{ Userinfo.userName }}
          </p>
          <div class="my-1 d-flex align-center flex-wrap">
            <RoleChip
              v-for="roleId of Userinfo.role"
              :roleId="roleId"
              :userId="Userinfo.userId"
            />
            <RoleAdd :userId="props.userId" />
          </div>
        </div>
      </div>

      <span class="px-4 d-flex flex-wrap">
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

      <m-card color="cardInner" class="mx-4 mb-4 mt-2 flex-grow-1">

        <span v-if="displayPage==='joinedChannel'">
          <p>参加チャンネル</p>
          {{ Userinfo.channelJoined }}
        </span>

        <span v-if="displayPage==='manage'">
          <span v-if="!Userinfo.banned">
            <p class="text-caption text-disabled text-center">ダブルクリックでBAN</p>
            <m-btn @dblclick="banUser" color="error" block>BAN</m-btn>
          </span>
          <span v-else>
            <p class="text-caption text-disabled text-center">ダブルクリックで解除</p>
            <m-btn @dblclick="pardonUser" color="info" block>BANを解除する</m-btn>
          </span>
        </span>

        <span v-if="displayPage==='JSON'">
          {{ Userinfo }}
        </span>

      </m-card>
    </m-card>
  </v-dialog>
</template>
