<template>
  <div class="pa-4 d-flex">

    <!-- 左部分(サイドバー) -->
    <div class="d-flex flex-column" style="width:30%; max-width:250px;">
        <p class="text-h6 pa-2">設定</p>
        <NuxtLink to="/settings/sync">
          <v-card
            class="rounded-pill py-2 px-3"
            :variant="$route.path==='/settings/sync'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon>mdi:mdi-sync</v-icon>
            同期設定
          </v-card>
        </NuxtLink>
        <NuxtLink to="/settings/theme">
          <v-card
            class="rounded-pill py-2 px-3"
            :variant="$route.path==='/settings/theme'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon>mdi:mdi-theme-light-dark</v-icon>
            テーマ
          </v-card>
        </NuxtLink>
    </div>

    <!-- 右部分 -->
    <div style="width:100%;" class="pa-3">
      <slot />
    </div>

  </div>
</template>