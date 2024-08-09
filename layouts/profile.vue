<script setup lang="ts">
</script>

<template>
  <div class="py-4 d-flex">

    <!-- 左部分(サイドバー) -->
    <div class="d-flex flex-column" style="width:20%; max-width:250px;">
      <p class="text-h5 py-4 px-8" style="font-weight:700;">プロフィール</p>

      <!-- 全般 -->
      <span class="pl-2">
        <NuxtLink to="/profile/me">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/profile/me'?'tonal':'text'"
            :ripple="false"
          >
            <v-avatar class="mr-2" size="x-small">
              <v-img :src="'/icon/' + getMyUserinfo.userId" />
            </v-avatar>
            あなた
          </v-card>
        </NuxtLink>
        <NuxtLink to="/profile/session">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/profile/session'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-theme-light-dark</v-icon>
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
