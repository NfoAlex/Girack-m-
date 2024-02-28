<script setup lang="ts">
import { useConfig } from '~/stores/config';
import { useMyUserinfo } from '~/stores/userinfo';
import { socket } from '~/socketHandlers/socketInit';

const { getConfig, getConfigSyncStatus } = storeToRefs(useConfig());
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

//設定データを監視する
watch(getConfig.value, () => {
  //同期がONならサーバーと同期する
  if (getConfigSyncStatus) {
    //設定データを送信、更新させる
    socket.emit("saveUserConfig", {
      RequestSender: {
        userId: getMyUserinfo.value.userId,
        sessionId: getSessionId.value
      },
      config: getConfig.value
    });
  }

  //localStorageで設定データを書き込む
  setConfigLocal(getConfig.value);
});
</script>

<template>
  <div class="py-4 d-flex">

    <!-- 左部分(サイドバー) -->
    <div class="d-flex flex-column" style="width:30%; max-width:250px;">
      <p class="text-h5 py-4 px-8">設定</p>

      <!-- 全般 -->
      <span class="pl-2">
        <NuxtLink to="/settings/sync">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/settings/sync'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-sync</v-icon>
            同期設定
          </v-card>
        </NuxtLink>
        <NuxtLink to="/settings/theme">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/settings/theme'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-theme-light-dark</v-icon>
            テーマ
          </v-card>
        </NuxtLink>
      </span>

      <!-- UIカテゴリ -->
      <span class="pt-5 pb-2">
        <p class="pl-4">UI</p>
        <v-divider></v-divider>
      </span>
      <span class="pl-2">
        <NuxtLink to="/settings/channel">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/settings/channel'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-pound</v-icon>
            チャンネル
          </v-card>
        </NuxtLink>
        <NuxtLink to="/settings/sidebar">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/settings/sidebar'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-format-list-bulleted-square</v-icon>
            <p>サイドバー</p>
          </v-card>
        </NuxtLink>
      </span>

      <!-- その他 -->
      <span class="pt-5 pb-2">
        <p class="pl-4">その他</p>
        <v-divider></v-divider>
      </span>
      <span class="pl-2">
        <NuxtLink to="/settings/privacy">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/settings/privacy'?'tonal':'text'"
            :ripple="false"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-antenna</v-icon>
            プライバシー
          </v-card>
        </NuxtLink>
        <NuxtLink to="/settings/JSONs">
          <v-card
            class="rounded-pill py-2 px-3 d-flex align-center"
            :variant="$route.path==='/settings/JSONs'?'tonal':'text'"
            :ripple="false"
            color="orange"
          >
            <v-icon class="mr-2" size="small">mdi:mdi-cog</v-icon>
            DEBUG :: 設定用JSON一覧
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
