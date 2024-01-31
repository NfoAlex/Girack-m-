<script lang="ts">

export default {
  setup() {
    definePageMeta({
      layout: 'plain' //レイアウトを何もないやつに設定
    });
  }
}

</script>

<template>
  <div class="d-flex" style="height:100vh; width:100vw;">
    <div
      class="instanceImage me-auto mr-n5"
    >
      ここが画像になる
    </div>
    <!-- ログイン/登録用パネル -->
    <v-card class="panel rounded-e-0 d-flex flex-column justify-center">
      <!-- 真ん中表示部分 -->
      <div class="d-flex flex-column">
        <p class="my-2">ログイン</p>
        <v-text-field variant="outlined"></v-text-field>
        <p class="my-2">パスワード</p>
        <v-text-field variant="outlined"></v-text-field>

        <v-btn
          class="mt-5"
          size="large"
          color="primary"
          block
        >
          ログイン!
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<style scoped>

.instanceImage {
  /* デバッグ用ここから */
  background-color: lightblue;
  /* ここまで */

  width:100%;

  z-index: 50;
}

.panel {
  width: 35vw;
  min-width:400px;
  max-width: 500px;

  background-color: rgb(var(--v-theme-background));

  z-index: 100;
}

</style>