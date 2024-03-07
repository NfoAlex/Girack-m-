<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
</script>

<template>
  <div class="py-4 d-flex">

    <!-- 左部分(サイドバー) -->
    <div class="d-flex flex-column" style="width:30%; max-width:250px;">
      <p class="text-h5 py-4 px-8">サーバー管理</p>

      <!-- 全般 -->
      <span class="pl-2">
        <NuxtLink to="/server">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/server'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-server</v-icon>
            トップ
          </v-card>
        </NuxtLink>

        <NuxtLink to="/server/role">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/server/role'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-badge-account-outline</v-icon>
            ロール
          </v-card>
        </NuxtLink>
      </span>

    </div>

    <!-- 右部分 -->
    <div style="width:100%;" class="pa-3">
      <slot />
    </div>

  </div>
</template>
