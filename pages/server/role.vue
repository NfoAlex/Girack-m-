<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
import type role from '~/types/role';

/**
 * data
 */
const roleData = ref<role[]>([]);

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
</script>

<template>
  <div>
    <NuxtLayout name="server" style="height:100%;">
      <div class="d-flex flex-column" style="height:100%;">

        <p class="text-h5">ロール管理</p>
        <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />

        <div>
          <p>ロールリスト</p>
          <v-chip
            v-for="role in roleData"
            class="ma-1"
          >
            {{ role.name }}
          </v-chip>
        </div>

        <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />

      </div>
    </NuxtLayout>
  </div>
</template>
