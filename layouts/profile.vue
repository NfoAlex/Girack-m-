<script setup lang="ts">
import { useMyUserinfo } from "~/stores/userinfo";
const { getMyUserinfo } = storeToRefs(useMyUserinfo());
</script>

<template>
  <div class="py-4 d-flex">

    <!-- 左部分(サイドバー) -->
    <div class="d-flex flex-column" style="width:20%; max-width:250px;">
      <p class="text-h6 py-4 px-4" style="font-weight:700;">プロフィール</p>

      <!-- 全般 -->
      <span class="pl-2">
        <NuxtLink to="/profile/me">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/profile/me'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2">mdi:mdi-account</v-icon>
            あなた
          </v-card>
        </NuxtLink>
        <NuxtLink to="/profile/session">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/profile/session'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-key-chain</v-icon>
            セッション
          </v-card>
        </NuxtLink>
      </span>
    </div>

    <!-- 右部分 -->
    <div style="width:80%;" class="pa-3 mx-auto">
      <slot />
    </div>

  </div>
</template>
