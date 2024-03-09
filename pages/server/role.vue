<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
import type role from '~/types/role';

/**
 * data
 */
const roleData = ref<role[]>([]); //ロールデータの配列
const roleEditing = ref<role>({ //編集用のロールデータ
  roleId: '',
  name: '',
  ServerManage: false,
  RoleManage: false,
  ChannelRename: false,
  ChannelViewPrivate: false,
  ChannelCreateAndDelete: false,
  UserManage: false,
  MessageDelete: false,
  MessageAttatchFile: false
});

/**
 * ロールデータの受信
 * @param dat
 */
const SOCKETfetchRoles = (dat:{result:string, data:role[]}) => {
  console.log("role :: SOCKETfetchRoles : dat->", dat);
  roleData.value = dat.data;
}

onMounted(() => {
  socket.on("RESULT::fetchRoles", SOCKETfetchRoles);

  //ロールの取得
  socket.emit("fetchRoles", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchRoles", SOCKETfetchRoles);
});
</script>

<template>
  <div>
    <NuxtLayout name="server" style="height:100%;">
      <div class="d-flex flex-column" style="height:100%;">

        <p class="text-h5">ロール管理</p>
        <v-divider class="pb-0 mt-3" thickness="3" />

        <p class="text-h6 py-2">ロールリスト</p>
        <div style="max-height:30vh; overflow-y:auto;" class="py-3">
          <v-chip
            v-for="role in roleData"
            @click="roleEditing = role"
            class="ma-1"
          >
            {{ role.name }}
          </v-chip>
        </div>

        <v-divider class="py-0 mb-3" />

        <p class="text-h6 py-2">設定管理</p>
        <ServerRoleManager :roleEditing="roleEditing" />

      </div>
    </NuxtLayout>
  </div>
</template>
