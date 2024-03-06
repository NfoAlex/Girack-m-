<template>
  <div class="d-flex ma-0 pa-0" style="height: 100vh; width: 100vw">
    <!-- サイドバー -->
    <div class="sidebar d-flex flex-column pa-3">
      <!-- ホームボタン -->
      <span>
        <NuxtLink to="/">
          <v-btn
            icon=""
            :variant="$route.path === '/' ? 'tonal' : 'text'"
            :color="$route.path === '/' ? 'primary' : ''"
            rounded="lg"
            class="mt-2"
          >
            <v-icon size="large">mdi:mdi-home</v-icon>
          </v-btn>
          <p
            class="text-caption text-center"
            :class="$route.path === '/' ? 'text-primary' : null"
          >
            ホーム
          </p>
        </NuxtLink>
      </span>

      <!-- チャンネルブラウザボタン -->
      <span class="mt-4">
        <NuxtLink to="/browser">
          <v-btn
            icon=""
            :variant="$route.path === '/browser' ? 'tonal' : 'text'"
            :color="$route.path === '/browser' ? 'primary' : ''"
            rounded="lg"
            class="mt-2"
          >
            <v-icon size="large">mdi:mdi-format-list-bulleted-square</v-icon>
          </v-btn>
          <p
            class="text-caption text-center"
            :class="$route.path === '/browser' ? 'text-primary' : null"
          >
            一覧
          </p>
        </NuxtLink>
      </span>

      <v-divider class="mt-4"></v-divider>

      <!-- チャンネルボタン -->
      <span class="mt-4">
        <NuxtLink to="/channel">
          <v-btn
            icon=""
            :variant="$route.path === '/channel' ? 'tonal' : 'text'"
            :color="$route.path === '/channel' ? 'primary' : ''"
            rounded="lg"
          >
            <v-icon size="large">mdi:mdi-pound</v-icon>
          </v-btn>
          <p
            class="text-caption text-center"
            :class="$route.path === '/channel' ? 'text-primary' : null"
          >
            会話
          </p>
        </NuxtLink>
      </span>

      <!-- ------ ここから下 ----- -->

      <v-divider class="mt-auto"></v-divider>

      <!-- プロフィールボタン -->
      <span class="mt-2">
        <NuxtLink to="/profile">
          <v-btn
            icon="mdi:mdi-account"
            :variant="$route.path.includes('/profile') ? 'tonal' : 'text'"
            :color="$route.path.includes('/profile') ? 'primary' : ''"
            rounded="lg"
          >
          </v-btn>
          <p
            class="text-caption text-center"
            :class="$route.path.startsWith('/profile') ? 'text-primary' : null"
          >
            あなた
          </p>
        </NuxtLink>
      </span>

      <!-- 設定ボタン -->
      <span class="mt-4">
        <NuxtLink to="/settings">
          <v-btn
            icon="mdi:mdi-cog"
            :variant="$route.path.includes('/settings') ? 'tonal' : 'text'"
            :color="$route.path.includes('/settings') ? 'primary' : ''"
            rounded="lg"
          >
          </v-btn>
          <p
            class="text-caption text-center"
            :class="$route.path.startsWith('/settings') ? 'text-primary' : null"
          >
            設定
          </p>
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
            color="orange"
          >
          </v-btn>
          <p class="text-caption text-center">認証</p>
        </NuxtLink>
      </span>
    </div>

    <!-- メイン -->
    <div class="mainContainer align-self-auto">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  height: 100vh;
}

.mainContainer {
  height: 100vh;
  width: 100%;
  background: rgb(var(--v-theme-background));

  overflow-y: auto;

  border-radius: 28px 0 0 28px;
}
</style>
