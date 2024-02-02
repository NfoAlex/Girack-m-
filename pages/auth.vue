<script lang="ts">

export default {
  setup() {
    definePageMeta({
      layout: 'plain' //レイアウトを何もないやつに設定
    });
  },

  data() {
    return {
      authMode: "LOGIN" as string, // "LOGIN" | "REGISTER"
      processingAuth: false as boolean, //ボタンの処理中表示用
    }
  },

  methods: {
    //ログイン認証
    login():void {
      //処理中と設定
      this.processingAuth = true;

      //FOR DEBUG
      setTimeout(() => {
        this.processingAuth = false;
      }, 1500);
    },

    //新規登録
    register():void {
      //処理中と設定
      this.processingAuth = true;

      //FOR DEBUG
      setTimeout(() => {
        this.processingAuth = false;
      }, 1500);
    }
  }

}

</script>

<template>
  <div class="d-flex" style="height:100vh; width:100vw;">

    <!-- カバー画像 -->
    <div
      class="instanceImage me-auto mr-n5"
    >
      ここが画像になる
    </div>

    <!-- ログイン/登録用パネル -->
    <v-card class="panel pa-6 rounded-e-0 d-flex flex-column justify-center">
      <!-- ログイン/登録ボタン -->
      <div class="d-flex justify-center py-4">
        <v-btn
          @click="authMode='LOGIN'"
          class="mx-1"
          size="large"
          :color="authMode==='LOGIN'?'primary':null"
          :variant="authMode==='LOGIN'?'tonal':'text'"
        >ログイン</v-btn>
        <v-btn
          @click="authMode='REGISTER'"
          class="mx-1"
          size="large"
          :color="authMode==='REGISTER'?'primary':null"
          :variant="authMode==='REGISTER'?'tonal':'text'"
        >新規登録</v-btn>
      </div>
      <!-- 真ん中表示部分 -->
        <!-- ログイン部分 -->
      <div v-if="authMode==='LOGIN'" class="d-flex flex-column">
        <p class="my-2">ユーザー名</p>
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi:mdi-account"
        ></v-text-field>
        <p class="my-2">パスワード</p>
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi:mdi-key"
          type="password"
        ></v-text-field>

        <!-- ログインボタン -->
        <v-btn
          @click="login"
          :loading="processingAuth"
          class="mt-5"
          size="large"
          color="primary"
          block
        >
          ログイン!
        </v-btn>
      </div>
        <!-- 登録部分 -->
      <div v-else class="d-flex flex-column">
        <p class="my-2">ユーザー名</p>
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi:mdi-account"
        ></v-text-field>
        <p class="my-2">招待コード</p>
        <v-text-field
          variant="outlined"
          prepend-inner-icon="mdi:mdi-email"
        ></v-text-field>

        <!-- 登録ボタン -->
        <v-btn
          @click="register"
          :loading="processingAuth"
          class="mt-5"
          size="large"
          color="primary"
          block
        >
          登録する
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