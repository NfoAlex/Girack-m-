<script setup lang="ts">
import calcMyRole from "~/composables/calcMyRole";
import calcRole from "~/composables/calcRole";
import getMyRolePower from "~/composables/getMyRolePower";
import { socket } from "~/socketHandlers/socketInit";
import { useRole } from "~/stores/role";
import { useMyUserinfo } from "~/stores/userinfo";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getRoleSingle } = storeToRefs(useRole());

const props = defineProps<{
  roleId: string;
  userId?: string;
}>();

/**
 * data
 */
const mouseHoveredOnDot = ref<boolean>(false); //ホバーしたかどうか
const canUnlinkThis = ref<boolean>(false); //外せるかどうか

/**
 * ロールを外す
 */
const unlinkRole = () => {
  //メンバーのデフォルトロールかホスト専用ロールじゃないなら外す
  if (props.roleId !== "MEMBER" && props.roleId !== "HOST") {
    socket.emit("unlinkRole", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value,
      },
      targetUserId: props.userId,
      roleId: props.roleId,
    });
  }
};

onMounted(() => {
  //ユーザーIDが渡されているならレベル比較処理
  if (props.userId !== undefined) {
    //ロール情報取得
    const roleInfo = useRole().getRoleSingle(props.roleId);
    //権限レベル計算
    const roleLevel = calcRole(roleInfo);
    const MyRoleLevel = calcMyRole();

    //レベル比較して外せるかどうか設定
    if (roleLevel <= MyRoleLevel && getMyRolePower().RoleManage)
      canUnlinkThis.value = true;
  }
});
</script>

<template>
  <v-chip size="small" class="ma-1">
    <v-icon
      @click="() => {
        if (props.roleId !== 'MEMBER' && props.roleId !== 'HOST' && props.userId !== undefined) 
          unlinkRole()
      }"
      @mouseover="() => {
        if (
          props.roleId !== 'MEMBER' && 
          props.roleId !== 'HOST' &&
          props.userId !== undefined &&
          canUnlinkThis
          ) mouseHoveredOnDot = true
      }"
      @mouseleave="mouseHoveredOnDot = false"
      :color="getRoleSingle(props.roleId).color"
      class="mr-2"
    >
      {{ mouseHoveredOnDot?"mdi-close-circle":"mdi-circle" }}
    </v-icon>
    {{ getRoleSingle(props.roleId).name }}
  </v-chip>
</template>
