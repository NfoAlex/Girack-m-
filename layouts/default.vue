<script lang="ts">

export default {
  mounted() {
    console.log("default :: mounted : $route->", this.$route);
  }
}

</script>

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

      <span class="mt-auto">
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
  background: #fff;
}

</style>
