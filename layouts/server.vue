<script setup lang="ts">
import getMyRolePower from "~/composables/getMyRolePower";
</script>

<template>
  <div class="pt-4 d-flex">

    <!-- 左部分(サイドバー) -->
    <div class="d-flex flex-column flex-grow-1 flex-shrink-0" style="width:30%; max-width:250px;">
      <p class="text-h5 py-4 px-8" style="font-weight:700;">サーバー管理</p>

      <span class="pl-2">
        <NuxtLink v-if="getMyRolePower().ServerManage" to="/server">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/server'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-information</v-icon>
            基本情報
          </v-card>
        </NuxtLink>

        <NuxtLink v-if="getMyRolePower().ServerManage" to="/server/config">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/server/config'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-server</v-icon>
            インスタンス設定
          </v-card>
        </NuxtLink>

        <NuxtLink  v-if="getMyRolePower().RoleManage" to="/server/role">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/server/role'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-badge-account-outline</v-icon>
            ロール
          </v-card>
        </NuxtLink>

        <NuxtLink  v-if="getMyRolePower().ServerManage" to="/server/modapi">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/server/modapi'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-api</v-icon>
            API管理
          </v-card>
        </NuxtLink>
      </span>

    </div>

    <!-- 右部分 -->
    <div style="width:70%;" class="px-3 flex-shrink-1 mx-auto">
      <slot />
    </div>

  </div>
</template>
