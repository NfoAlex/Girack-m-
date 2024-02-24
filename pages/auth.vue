<script setup lang="ts">
import { socket } from "../socketHandlers/socketInit";
import { useServerinfo } from "../stores/serverinfo";
import { useMyUserinfo } from "../stores/userinfo";
import { setCookie } from "~/composables/setCookie";
import { getCookie } from "~/composables/getCookie";

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
      resultDisplay: "" as string,
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
      this.resultDisplay = "";

      //認証
      socket.emit("authLogin", {
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
      this.resultDisplay = "";

      //登録
      socket.emit("authRegister", {
        username: this.username,
        inviteCode: this.invitecode,
      });
    },

    //認証結果の受け取りと処理
    SOCKETRESULTauthLogin(dat:{result:string, data:{UserInfo:any, sessionId:string}}) {
      console.log("auth :: SOCKETRESULTauthLogin : dat->", dat);
      //ログインできたらユーザー情報設定、ページ移動
      if (dat.result === "SUCCESS") {
        //成功
        this.resultDisplay = "SUCCESS";
        //自ユーザー情報更新
        const updateMyUserinfo = useMyUserinfo().updateMyUserinfo;
        updateMyUserinfo({
          userName: dat.data.UserInfo.userName,
          userId: dat.data.UserInfo.userId,
          sessionId: dat.data.sessionId,
          role: dat.data.UserInfo.role.split(","), //文字列で渡されるためここで配列にする
          banned: dat.data.UserInfo.banned,
          channelJoined: dat.data.UserInfo.channelJoined.split(",") //文字列で渡されるためここで配列にする
        });

        //設定データを取得する
        socket.emit("fetchUserConfig", {
          userId: dat.data.UserInfo.userId,
          sessionId: dat.data.sessionId
        });

        //セッション情報をクッキーへ保存
        setCookie(
          "session",
          JSON.stringify( //文字列として保存する
            {
              userId: dat.data.UserInfo.userId,
              sessionId: dat.data.sessionId
            }
          ),
          15
        );

        //トップページへ移動
        this.$router.push("/");
      } else {
        //エラーを表示
        this.resultDisplay = "FAILED";
      }
      //認証状態中を解除
      this.processingAuth = false;
    },

    //登録結果の受け取りと処理
    SOCKETRESULTauthRegister(dat:{result:string, data:any}) {
      console.log("auth :: SOCKETRESULTauthRegister : dat->", dat);
      //結果処理
      if (dat.result === "SUCCESS") {
        this.passwordRegistered = dat.data.password; //結果用パスワードを格納
        this.resultDisplay = "SUCCESS"; //結果成功ととして表示
        this.resultRegisterDone = true; //結果成功ととして表示
      } else {
        this.resultDisplay = "FAILED";
        this.resultRegisterDone = false; //結果成功ととして表示
      }

      //認証状態中を解除
      this.processingAuth = false;
    },
  },

  mounted() {
    //認証結果受け取り
    socket.on("RESULTauthLogin", this.SOCKETRESULTauthLogin);
    //登録ができたと受信したときの処理
    socket.on("RESULTauthRegister", this.SOCKETRESULTauthRegister);

    //クッキーがあればそのまま認証
    if (getCookie("session") !== "") {
      let session = JSON.parse(getCookie("session"));

      //設定データを取得する
      socket.emit("fetchUserConfig", {
        userId: session.userId,
        sessionId: session.sessionId
      });
      //ユーザー情報取得
      socket.emit("fetchUserInfo", {
        RequestSender: {
          userId: session.userId,
          sessionId: session.sessionId
        },
        userId: session.userId
      });

      //トップページへ移動
      this.$router.push("/");
    }
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
      <!-- 認証結果の表示 -->
      <div>
        <v-alert
          v-if="resultDisplay==='FAILED'"
          type="error"
          class="flex-shrink-1 flex-grow-0"
          style="min-height:max-content;"
        >
          <v-alert-title>認証に失敗しました</v-alert-title>
        </v-alert>
      </div>
      <!-- ログイン/登録ボタン -->
      <div class="d-flex justify-center py-4">
        <m-btn
          @click="authMode='LOGIN'"
          class="mx-1"
          size="large"
          :color="authMode==='LOGIN'?'primary':null"
          :variant="authMode==='LOGIN'?'tonal':'text'"
        >ログイン</m-btn>
        <m-btn
          @click="authMode='REGISTER'"
          :disabled="!getServerinfo.registration.available"
          class="mx-1"
          size="large"
          :color="authMode==='REGISTER'?'primary':null"
          :variant="authMode==='REGISTER'?'tonal':'text'"
        >新規登録</m-btn>
      </div>
      <!-- 真ん中表示部分 -->
        <!-- ログイン部分 -->
      <div v-if="authMode==='LOGIN'" class="d-flex flex-column">
        <v-text-field
          v-model="username"
          variant="outlined"
          rounded="lg"
          label="ユーザー名"
          prepend-inner-icon="mdi:mdi-account"
        ></v-text-field>
        <v-text-field
          v-model="password"
          variant="outlined"
          rounded="lg"
          label="パスワード"
          prepend-inner-icon="mdi:mdi-key"
          type="password"
        ></v-text-field>

        <!-- ログインボタン -->
        <m-btn
          @click="login"
          :loading="processingAuth"
          class="mt-5"
          size="large"
          color="primary"
          block
        >
          ログイン!
        </m-btn>
      </div>
        <!-- 登録部分 -->
      <div v-else class="d-flex flex-column">
        <!-- 登録前 -->
        <div v-if="!resultRegisterDone">
          <v-text-field
            v-model="username"
            variant="outlined"
            rounded="lg"
            label="ユーザー名"
            prepend-inner-icon="mdi:mdi-account"
          ></v-text-field>
          <span v-if="getServerinfo.registration.invite.inviteOnly">
            <v-text-field
              v-model="invitecode"
              variant="outlined"
              rounded="lg"
              label="招待コード"
              prepend-inner-icon="mdi:mdi-email"
            ></v-text-field>
          </span>

          <!-- 登録ボタン -->
          <m-btn
            @click="register"
            :loading="processingAuth"
            class="mt-5"
            size="large"
            color="primary"
            block
          >
            登録する
          </m-btn>
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
