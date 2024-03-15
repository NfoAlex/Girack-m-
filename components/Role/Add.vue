<script setup lang="ts">
import { useRole } from '~/stores/role';

const { getRoles } = storeToRefs(useRole());

/**
 * data
 */
const displayRoleSelect = ref<boolean>(false);
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
