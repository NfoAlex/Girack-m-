<script setup lang="ts">
import getMyRolePower from "~/composables/getMyRolePower";
import { useMyUserinfo } from "~/stores/userinfo";
const { getMyUserinfo } = storeToRefs(useMyUserinfo());
</script>

<template>
  <div class="d-flex ma-0 pa-0">
    <!-- サイドバー -->
    <div class="d-flex flex-column pa-3 flex-grow-1 flex-shrink-0" style="overflow-y: auto;">
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

      <!-- チャンネルボタン -->
      <span class="mt-4">
        <NuxtLink to="/channel">
          <v-btn
            icon=""
            :variant="$route.path.startsWith('/channel') ? 'tonal' : 'text'"
            :color="$route.path.startsWith('/channel') ? 'primary' : ''"
            rounded="lg"
          >
            <v-icon size="large">mdi:mdi-pound</v-icon>
          </v-btn>
          <p
            class="text-caption text-center"
            :class="$route.path.startsWith('/channel') ? 'text-primary' : null"
          >
            会話
          </p>
        </NuxtLink>
      </span>

      <!-- ------ ここから下 ----- -->

      <v-divider class="mt-auto"></v-divider>

      <!-- プロフィールボタン -->
      <span class="mt-2">
        <NuxtLink to="/profile" class="d-flex flex-column align-center">
          <v-avatar
            class="rounded-lg"
            :style="$route.path.startsWith('/profile')?'border:solid 3px rgba(var(--v-theme-primary))':null"
          >
            <v-img :src="'/icon/' + getMyUserinfo.userId" :alt="getMyUserinfo.userId" />
          </v-avatar>
          <p
            class="text-caption text-center"
            :class="$route.path.startsWith('/profile') ? 'text-primary' : null"
          >
            あなた
          </p>
        </NuxtLink>
      </span>

      <!-- サーバー管理ボタン -->
      <span class="mt-4">
        <NuxtLink to="/users">
          <v-btn
            icon="mdi:mdi-account-group"
            :variant="$route.path.includes('/users') ? 'tonal' : 'text'"
            :color="$route.path.includes('/users') ? 'primary' : ''"
            rounded="lg"
          >
          </v-btn>
          <p
            class="text-caption text-center"
            :class="$route.path.startsWith('/users') ? 'text-primary' : null"
          >
            仲間
          </p>
        </NuxtLink>
      </span>

      <!-- サーバー管理ボタン -->
      <span v-if="getMyRolePower().ServerManage||getMyRolePower().RoleManage" class="mt-4">
        <NuxtLink to="/server">
          <v-btn
            icon="mdi:mdi-server-security"
            :variant="$route.path.includes('/server') ? 'tonal' : 'text'"
            :color="$route.path.includes('/server') ? 'primary' : ''"
            rounded="lg"
          >
          </v-btn>
          <p
            class="text-caption text-center"
            :class="$route.path.startsWith('/server') ? 'text-primary' : null"
          >
            管理
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
      
    </div>

    <!-- メイン -->
    <div class="mainContainer flex-grow-1">
      <slot />
    </div>
  </div>
</template>

<style scoped>

.mainContainer {
  width: 100%;
  
  background: rgb(var(--v-theme-background));

  overflow-y: auto;

  border-radius: 28px 0 0 28px;
}
</style>
