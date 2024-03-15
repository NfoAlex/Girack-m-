<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import { useRole } from '~/stores/role';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getRoles } = storeToRefs(useRole());

//prop
const props = defineProps<{
  userId: string
}>();

/**
 * data
 */
const displayRoleSelect = ref<boolean>(false);

/**
 * ロールを付与する
 */
const addRole = (roleIdAdding:string) => {
  socket.emit("addRole", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    targetUserId: props.userId,
    roleId: roleIdAdding
  });
};

</script>

<template>
  <v-chip
    @click="displayRoleSelect = true"
    variant="text"
    size="small"
    class="mx-1"
  >
  
    <v-menu activator="parent" class="rounded-lg">
      <v-list>
        <div
          v-for="(role, index) in getRoles()"
          @click="addRole(role.roleId)"
          :key="index"
          class="py-2 px-3 d-flex align-center"
        >
          <v-icon
            :color="role.color"
            size="small"
            class="mr-2"
          >
            mdi-circle
          </v-icon>
          <v-list-item-title>
            {{ role.name }}
          </v-list-item-title>
        </div>
      </v-list>
    </v-menu>

    <p>+</p>

  </v-chip>
</template>
