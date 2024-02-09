<script setup lang="ts">
import { socket } from "../socketHandlers/socketInit";
definePageMeta({
  layout: 'plain' //レイアウトを何もないやつに設定
});
</script>

<script lang="ts">

export default {
  data() {
    return {
      authMode: "LOGIN" as string, // "LOGIN" | "REGISTER"
      processingAuth: false as boolean, //ボタンの処理中表示用

      //text-field用
      username: "" as string, //ユーザー名
      password: "" as string, //パスワード
      invitecode: "" as string, //招待コード

      //結果用
      result: "" as string
    }
  },

  methods: {
    //ログイン認証
    login():void {
      //処理中と設定
      this.processingAuth = true;
      //認証結果を初期化
      this.result = "";

      socket.emit("auth", {
        username: this.username,
        password: this.password,
      },
        "alpha_20240206_1"
      );

      //FOR DEBUG
      // setTimeout(() => {
      //   this.processingAuth = false;
      //   this.$router.push("/"); //トップページへ移動
      // }, 1500);

    },

    //新規登録
    register():void {
      //処理中と設定
      this.processingAuth = true;
      //認証結果を初期化
      this.result = "";

      //FOR DEBUG
      setTimeout(() => {
        this.processingAuth = false;
      }, 1500);
    },

    //認証結果の受け取りと処理
    SOCKETauthResult(dat:any) {
      //ログインできたらページ移動
      if (dat.result) {
        this.result = "SUCCESS"; //成功
        setTimeout(() => this.$router.push("/"), 10); //トップページへ移動
      } else {
        this.result = "FAILED"; //エラーを表示
      }
      //認証状態中を解除
      this.processingAuth = false;
    },
  },

  mounted() {
    //認証結果受け取り
    socket.on("authResult", this.SOCKETauthResult);
  },

  unmounted() {
    //socketハンドラ解除
    socket.off("authResult");
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
      <!-- Girackタイトル -->
      <p class="text-h4 text-center my-5">Girack</p>
      <div>
        <v-alert
          v-if="result==='FAILED'"
          type="error"
          class="flex-shrink-1 flex-grow-0"
          style="min-height:max-content;"
        >
          <v-alert-title>認証に失敗しました</v-alert-title>
        </v-alert>
      </div>
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
          v-model="username"
          variant="outlined"
          prepend-inner-icon="mdi:mdi-account"
        ></v-text-field>
        <p class="my-2">パスワード</p>
        <v-text-field
          v-model="password"
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
          v-model="username"
          variant="outlined"
          prepend-inner-icon="mdi:mdi-account"
        ></v-text-field>
        <p class="my-2">招待コード</p>
        <v-text-field
          v-model="invitecode"
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