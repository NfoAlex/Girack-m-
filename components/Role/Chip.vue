<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import { useRole } from '~/stores/role';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getRoleSingle } = storeToRefs(useRole());

const props = defineProps<{
  roleId: string,
  userId: string
}>();

/**
 * data
 */
const mouseHoveredOnDot = ref<boolean>(false);

/**
 * ロールを外す
 */
const unlinkRole = () => {
  //メンバーのデフォルトロールかホスト専用ロールじゃないなら外す
  if (props.roleId !== "MEMBER" && props.roleId !== "HOST") {
    socket.emit("unlinkRole", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value
      },
      targetUserId: props.userId,
      roleId: props.roleId
    });
  }
}
</script>

<template>
  <v-chip size="small" class="mr-1 mt-1">
    <v-icon
      @click="unlinkRole"
      @mouseover="() => {
        if (props.roleId !== 'MEMBER' && props.roleId !== 'HOST') 
          mouseHoveredOnDot = true
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
