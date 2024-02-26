<template>
  <div class="py-4 d-flex">

    <!-- 左部分(サイドバー) -->
    <div class="d-flex flex-column" style="width:30%; max-width:250px;">
      <p class="text-h5 py-4 px-8">設定</p>

      <!-- 全般 -->
      <span class="pl-2">
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
      </span>

      <!-- UIカテゴリ -->
      <span class="pt-5 pb-2">
        <p class="pl-4">UI</p>
        <v-divider></v-divider>
      </span>
      <!-- 全般 -->
      <span class="pl-2">
        <NuxtLink to="/settings/channel">
          <v-card
            class="rounded-pill py-2 px-3"
            :variant="$route.path==='/settings/channel'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon>mdi:mdi-sync</v-icon>
            チャンネル
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
