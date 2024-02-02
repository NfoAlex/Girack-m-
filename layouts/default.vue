<template>
  <div class="d-flex ma-0 pa-0" style="height:100vh; width:100vw;">
    <!-- <span class="ma-3 d-flex flex-column">
      <NuxtLink to="/"><v-btn color="primary" class="mx-1">トップ</v-btn></NuxtLink>
      <NuxtLink to="/channel"><v-btn color="secondary" class="mx-1">チャンネルへ行ってみる</v-btn></NuxtLink>
      <NuxtLink to="/channel/1234"><v-btn color="secondary" class="mx-1">適当なチャンネル</v-btn></NuxtLink>
      <v-divider vertical></v-divider>
      <NuxtLink to="/auth"><v-btn color="error" class="mx-1">認証ページ</v-btn></NuxtLink>
    </span> -->
    <div class="sidebar d-flex flex-column pa-3">
      <v-btn
        icon="mdi:mdi-account"
        variant="text"
        rounded="lg"
      >
      </v-btn>
    </div>
    <div class="mainContainer rounded-xl align-self-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style>

html {
  background-color: #efefef
}

.mainContainer {
  height:100vh;
  width: 100%;
  background: #fff;
}

</style>
