<script setup lang="ts">
import { socket } from "../socketHandlers/socketInit";
import { useServerinfo } from "../stores/serverinfo";
import { useMyUserinfo } from "../stores/userinfo";

const { getMyUserinfo } = storeToRefs(useMyUserinfo());
const { getServerinfo } = storeToRefs(useServerinfo());

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
      result: "" as string,
      resultRegisterDone: false as boolean,
      passwordRegistered: "" as string
    }
  },

  methods: {
    //ログイン認証
    login():void {
      //処理中と設定
      this.processingAuth = true;
      //認証結果を初期化
      this.result = "";

      //認証
      socket.emit("auth", {
        username: this.username,
        password: this.password,
      },
        "alpha_20240206_1"
      );
    },

    //新規登録
    register():void {
      //処理中と設定
      this.processingAuth = true;
      //認証結果を初期化
      this.result = "";

      //登録
      socket.emit("register", {
        username: this.username,
        code: this.invitecode,
      });
    },

    //認証結果の受け取りと処理
    SOCKETauthResult(dat:any) {
      //ログインできたらページ移動
      if (dat.result) {
        //成功
        this.result = "SUCCESS";
        //自ユーザー情報更新
        const MyUserinfo = useMyUserinfo();
        MyUserinfo.updateMyUserinfo({
          username: dat.username,
          userid: dat.userid,
          sessionid: dat.sessionid,
          role: dat.role,
          channelJoined: dat.channelJoined
        });

        //トップページへ移動
        this.$router.push("/");
      } else {
        this.result = "FAILED"; //エラーを表示
      }
      //認証状態中を解除
      this.processingAuth = false;
    },

    //登録結果の受け取りと処理
    SOCKETregisterEnd(dat:any) {
      //結果処理
      if (dat.result === "SUCCESS") {
        this.passwordRegistered = dat.pass; //結果用パスワードを格納
        this.result = "SUCCESS"; //結果成功ととして表示
        this.resultRegisterDone = true; //結果成功ととして表示
      } else {
        this.result = "FAILED";
        this.resultRegisterDone = false; //結果成功ととして表示
      }

      //認証状態中を解除
      this.processingAuth = false;
    },
  },

  mounted() {
    //認証結果受け取り
    socket.on("authResult", this.SOCKETauthResult);
    //登録ができたと受信したときの処理
    socket.on("registerEnd", this.SOCKETregisterEnd);
  },

  unmounted() {
    //socketハンドラ解除
    socket.off("authResult");
    socket.off("registerEnd");
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
          :disabled="!getServerinfo.registration.available"
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
        <!-- 登録前 -->
        <div v-if="!resultRegisterDone">
          <p class="my-2">ユーザー名</p>
          <v-text-field
            v-model="username"
            variant="outlined"
            prepend-inner-icon="mdi:mdi-account"
          ></v-text-field>
          <span v-if="getServerinfo.registration.invite.inviteOnly">
            <p class="my-2">招待コード</p>
            <v-text-field
              v-model="invitecode"
              variant="outlined"
              prepend-inner-icon="mdi:mdi-email"
            ></v-text-field>
          </span>

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
        <!-- 登録完了後 -->
        <div v-if="resultRegisterDone">
          <p class="text-center text-h6 my-5">ようこそ!</p>
          <p>パスワード</p>
          <v-text-field
            v-model="passwordRegistered"
            readonly
            variant="filled"
            rounded="lg"
          ></v-text-field>
        </div>
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

  border-radius: 28px 0 0 28px !important;

  background-color: rgb(var(--v-theme-background));

  z-index: 100;
}

</style>