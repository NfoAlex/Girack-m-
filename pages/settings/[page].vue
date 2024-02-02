<script setup lang="ts">

definePageMeta({
  middleware: [
    function (to, from) {
      console.log("settings[page] :: definePageMeta : to->", to);
    },
    'settings',
  ],
});

</script>

<template>
  <div class="pa-4 d-flex">
    <!-- サイドバー -->
    <div class="d-flex flex-column" style="width:20%;">
        <p class="text-h6 pa-2">設定</p>
        <v-card @click="" class="rounded-pill py-2 px-3">同期設定</v-card>
    </div>
    <div>
      <SettingsSync />
    </div>
  </div>
</template>