<script lang="ts">

export default {
  mounted() {
    console.log("settings[page] :: onMounted : $route->", this.$route);
  }
}

</script>

<template>
  <div class="pa-4 d-flex">

    <!-- 左部分(サイドバー) -->
    <div class="d-flex flex-column" style="width:20%;">
        <p class="text-h6 pa-2">設定</p>
        <v-card @click="$router.push('/settings/sync')" class="rounded-pill py-2 px-3">
          同期設定
        </v-card>
        <v-card @click="$router.push('/settings/theme')" class="rounded-pill py-2 px-3">
          テーマ
        </v-card>
    </div>

    <!-- 右部分 -->
    <div style="width:100%;" class="pa-3">
      <SettingsSync
        v-if="$route.path==='/settings/sync'"
      />
      <SettingsTheme
        v-if="$route.path==='/settings/theme'"
      />
    </div>

  </div>
</template>