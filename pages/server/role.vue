<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import calcRole from "~/composables/calcRole";
import { useMyUserinfo } from "~/stores/userinfo";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
import type role from "~/types/role";

/**
 * data
 */
const roleData = ref<role[]>([]); //ロールデータの配列
const roleEditing = ref<role>({
  //編集用のロールデータ
  roleId: "",
  name: "",
  color: "",
  ServerManage: false,
  RoleManage: false,
  ChannelManage: false,
  UserManage: false,
  MessageDelete: false,
  MessageAttatchFile: false,
  APIUse: false
});
const displayCreateRole = ref<boolean>(false); //ロール作成画面表示用

/**
 * ロールデータの受信、格納
 * @param dat
 */
const SOCKETfetchRoles = (dat: { result: string; data: role[] }) => {
  //console.log("role :: SOCKETfetchRoles : dat->", dat);
  //格納
  roleData.value = dat.data;
  //編集中のロールを最初のやつに設定
  roleEditing.value = dat.data[0];
};

onMounted(() => {
  socket.on("RESULT::fetchRoles", SOCKETfetchRoles);

  //ロールの取得
  socket.emit("fetchRoles", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchRoles", SOCKETfetchRoles);
});
</script>

<template>

  <ServerCreateRole
    v-model="displayCreateRole"
    @closeDialog="displayCreateRole = false"
  />

  <div style="height:100%;">
    <NuxtLayout name="server" style="height:100%; width:100%;">
      <div class="d-flex flex-column" style="height:100%;">

        <p class="text-h5">ロール管理</p>
        <v-divider class="pb-0 mt-3" thickness="3" />

        <p class="text-h6 py-2">ロールリスト</p>
        <div style="max-height:25vh; overflow-y:auto;" class="py-6 flex-grow-1">
          <v-chip
            v-for="role in roleData"
            @click="roleEditing = role"
            class="ma-1"
            :variant="roleEditing.roleId === role.roleId ? 'outlined' : 'tonal'"
          >
            <v-icon
              v-if="role.roleId==='MEMBER' || role.roleId==='HOST'"
              class="mr-1"
            >
              mdi-lock
            </v-icon>
            <v-icon :color="role.color" class="mr-2">mdi-circle</v-icon>
            {{ role.name }}
          </v-chip>
          <v-chip @click="displayCreateRole = true" class="ma-1" variant="text">+</v-chip>
        </div>

        <v-divider class="py-0 mb-3" />

        <span class="text-h6 py-2 flex-grow-0 flex-shrink-1 d-flex">
          <p class="flex-grow-0 flex-shrink-0">設定管理</p>
          <v-chip
            class="mx-2 flex-shrink-1 flex-grow-0 text-truncate"
            style="max-width:fit-content;"
          >
            <v-icon
              v-if="roleEditing.roleId==='MEMBER' || roleEditing.roleId==='HOST'"
              class="mr-1"
            >
              mdi-lock
            </v-icon>
            <v-icon :color="roleEditing.color" class="mr-2">mdi-circle</v-icon>
            {{ roleEditing.name }}
          </v-chip>
          <v-divider vertical class="mr-2" />
          <p class="flex-grow-1 flex-shrink-0">レベル : {{ calcRole(roleEditing) }}</p>
        </span>
        <ServerRoleManager :roleEditing="roleEditing" />

      </div>
    </NuxtLayout>
  </div>
</template>
