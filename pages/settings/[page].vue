<script lang="ts">

export default {
  mounted() {
    console.log("settings[page] :: onMounted : $route->", this.$route);
  }
}

</script>

<template>
  <div class="pa-4 d-flex">

    <!-- サイドバー -->
    <div class="d-flex flex-column" style="width:20%;">
        <p class="text-h6 pa-2">設定</p>
        <v-card @click="" class="rounded-pill py-2 px-3">同期設定</v-card>
    </div>

    <div style="width:100%;">
      <SettingsSync
        v-if="$route.path==='/settings/sync'"
      />
    </div>

  </div>
</template>