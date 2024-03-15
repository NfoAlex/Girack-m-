<script setup lang="ts">
import { useRole } from '~/stores/role';

const { getRoleSingle } = storeToRefs(useRole());

const props = defineProps<{
  roleId: string
}>();
</script>

<template>
  <v-chip size="small" class="mr-1 mt-1">
    <v-icon
      :color="getRoleSingle(props.roleId).color"
      class="mr-2"
    >
      mdi-circle
    </v-icon>
    {{ getRoleSingle(props.roleId).name }}
  </v-chip>
</template>
