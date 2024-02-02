<script setup lang="ts">

import { onMounted } from "vue";
const router = useRouter();

onMounted(() => {
  console.log("default :: mounted : router->", router);
});

</script>

<template>
  <div class="d-flex ma-0 pa-0" style="height:100vh; width:100vw;">
    <!-- サイドバー -->
    <div class="sidebar d-flex flex-column pa-3">
      <!-- ホームボタン -->
      <span>
        <NuxtLink to="/">
          <v-btn
            icon=""
            :variant="$route.path==='/'?'tonal':'text'"
            :color="$route.path==='/'?'primary':null"
            rounded="lg"
            class="mt-2"
          >
            <v-icon size="large">mdi:mdi-home</v-icon>
          </v-btn>
          <p class="text-caption text-center">ホーム</p>
        </NuxtLink>
      </span>

      <!-- チャンネルボタン -->
      <span class="mt-4">
        <NuxtLink to="/channel">
          <v-btn
            icon=""
            :variant="$route.path==='/channel'?'tonal':'text'"
            :color="$route.path==='/channel'?'primary':null"
            rounded="lg"
          >
            <v-icon size="large">mdi:mdi-pound</v-icon>
          </v-btn>
          <p class="text-caption text-center">チャット</p>
        </NuxtLink>
      </span>

      <!-- ------ ここから下 ----- -->

      <v-divider class="mt-auto"></v-divider>

      <!-- 設定ボタン -->
      <span class="mt-1">
        <NuxtLink to="/settings">
          <v-btn
            icon="mdi:mdi-cog"
            :variant="$route.path.includes('/settings')?'tonal':'text'"
            :color="$route.path.includes('/settings')?'primary':null"
            rounded="lg"
          >
          </v-btn>
          <p class="text-caption text-center">設定</p>
        </NuxtLink>
      </span>

      <!-- FOR DEBUG :: ログインページへ -->
      <span class="mt-3">
        <NuxtLink to="/auth">
          <v-btn
            icon="mdi:mdi-lock"
            variant="text"
            rounded="lg"
            class=""
            color="error"
          >
          </v-btn>
          <p class="text-caption text-center">認証</p>
        </NuxtLink>
      </span>
    </div>

    <!-- メイン -->
    <div class="mainContainer rounded-xl align-self-auto">
      <slot />
    </div>

  </div>
</template>

<style scoped>

.sidebar {
  height: 100vh;
}

.mainContainer {
  height:100vh;
  width: 100%;
  background: rgb(var(--v-theme-background));
}

</style>
