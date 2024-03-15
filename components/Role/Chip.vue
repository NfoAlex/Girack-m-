<script setup lang="ts">
import { useRole } from '~/stores/role';

const { getRoleSingle } = storeToRefs(useRole());

const props = defineProps<{
  roleId: string
}>();

/**
 * data
 */
const mouseHoveredOnDot = ref<boolean>(false);
</script>

<template>
  <v-chip size="small" class="mr-1 mt-1">
    <v-icon
      @mouseover="mouseHoveredOnDot = true"
      @mouseleave="mouseHoveredOnDot = false"
      :color="getRoleSingle(props.roleId).color"
      class="mr-2"
    >
      {{ mouseHoveredOnDot?"mdi-close-circle":"mdi-circle" }}
    </v-icon>
    {{ getRoleSingle(props.roleId).name }}
  </v-chip>
</template>
