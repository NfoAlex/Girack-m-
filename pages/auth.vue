<script setup lang="ts">
import { socket } from "../socketHandlers/socketInit";
import { useServerinfo } from "../stores/serverinfo";
import { useMyUserinfo } from "../stores/userinfo";
import { useConfig } from "../stores/config";
import type { MyUserinfo } from "~/types/user";

const { getServerinfo } = storeToRefs(useServerinfo());
const { updateSessionId } = useMyUserinfo();
const router = useRouter();

definePageMeta({
  layout: "plain", //レイアウトを何もないやつに設定
});

/**
 * data
 */
const authMode = ref<string>("LOGIN"); // "LOGIN" | "REGISTER"
const processingAuth = ref<boolean>(false); //ボタンの処理中表示用
// text-field用
const username = ref<string>("");
const password = ref<string>("");
const invitecode = ref<string>("");
// 結果用
const resultDisplay = ref<string>("");
const resultRegisterDone = ref<boolean>(false);
const passwordRegistered = ref<string>("");

/**
 * ログイン処理
 */
const login = () => {
  //処理中と設定
  processingAuth.value = true;
  //認証結果を初期化
  resultDisplay.value = "";

  //認証
  socket.emit(
    "authLogin",
    {
      username: username.value,
      password: password.value,
    }
  );
};

/**
 * ログイン後のGirack-m-準備処理
 */
const initialize = (userId:string, sessionId:string) => {
  //全ロールを取得
  socket.emit("fetchRoles", {
    RequestSender: {
      userId: userId,
      sessionId: sessionId,
    },
  });

  //ユーザー情報取得
  socket.emit("fetchUserInfo", {
    RequestSender: {
      userId: userId,
      sessionId: sessionId,
    },
    userId: userId,
  });

  //localStorageから設定を読み込む
  const datConfigLocal = getConfigLocal();
  if (datConfigLocal !== null) {
    //同期設定がONなら設定取得
    if (datConfigLocal.sync || datConfigLocal.config === null) {
      //設定データを取得する
      socket.emit("fetchUserConfig", {
        userId: userId,
        sessionId: sessionId,
      });
    } else {
      //localStorageにある設定データをそのまま適用
      useConfig().updateConfig(datConfigLocal.config);
      //同期設定をオフとして設定
      useConfig().updateConfigSyncStatus(false);
    }
  } else { //設定データがないなら絶対取得
    //設定データを取得する
    socket.emit("fetchUserConfig", {
      userId: userId,
      sessionId: sessionId,
    });
  }

  //トップページへ移動
  router.push("/");
};

/**
 * 新規登録
 */
const register = () => {
  //処理中と設定
  processingAuth.value = true;
  //認証結果を初期化
  resultDisplay.value = "";

  //登録
  socket.emit("authRegister", {
    username: username.value,
    inviteCode: invitecode.value,
  });
};

/**
 * Cookieからセッションデータを取得
 */
const getSessionFromCookie = ():{
  userId:string,
  sessionId:string
}|undefined => {
  //取得
  const tempCookie = useCookie("session").value;

  //無効な値ならundefuned
  if (
    tempCookie === undefined || tempCookie === null || typeof(tempCookie) !== "object"
  ) return undefined;
  //値を確認してあるならそれを返す
    //ここで型エラーが出るが結果はきちんとJSONを返すためこのまま
  if (
    tempCookie.userId !== undefined
    &&
    tempCookie.sessionId != undefined
  ) {
    return tempCookie;
  } else {
    return undefined;
  }
}

/**
 * 認証結果の受け取りと処理
 * @param dat
 */
const SOCKETRESULTauthLogin = (
  dat: {
    result: string;
    data: { UserInfo: any; sessionId: string };
  }
) => {
  console.log("auth :: SOCKETRESULTauthLogin : dat->", dat);
  //ログインできたらユーザー情報設定、ページ移動
  if (dat.result === "SUCCESS") {
    //成功
    resultDisplay.value = "SUCCESS";
    //自ユーザー情報更新
    const updateMyUserinfo = useMyUserinfo().updateMyUserinfo;
    updateMyUserinfo({
      userName: dat.data.UserInfo.userName,
      userId: dat.data.UserInfo.userId,
      role: dat.data.UserInfo.role, //文字列で渡されるためここで配列にする
      banned: dat.data.UserInfo.banned,
      channelJoined: dat.data.UserInfo.channelJoined, //文字列で渡されるためここで配列にする
    });
    //セッションID更新
    updateSessionId(dat.data.sessionId);

    //セッション情報をクッキーへ保存
    useCookie("session", {maxAge:1.296e+6}).value = JSON.stringify({
      userId: dat.data.UserInfo.userId,
      sessionId: dat.data.sessionId,
    });

    //準備処理開始
    initialize(dat.data.UserInfo.userId, dat.data.sessionId);
  } else {
    //エラーを表示
    resultDisplay.value = "FAILED";
  }
  //認証状態中を解除
  processingAuth.value = false;
};

/**
 * 登録結果の受け取りと処理
 * @param dat
 */
const SOCKETRESULTauthRegister = (
  dat: {
    result: string;
    data:{datUser:MyUserinfo, password:string}
  }
) => {
  console.log("auth :: SOCKETRESULTauthRegister : dat->", dat);
  //結果処理
  if (dat.result === "SUCCESS") {
    passwordRegistered.value = dat.data.password; //結果用パスワードを格納
    resultDisplay.value = "SUCCESS"; //結果成功ととして表示
    resultRegisterDone.value = true; //結果成功ととして表示
  } else {
    resultDisplay.value = "FAILED";
    resultRegisterDone.value = false; //結果成功ととして表示
  }

  //認証状態中を解除
  processingAuth.value = false;
};

onMounted(() => {
  //認証結果受け取り
  socket.on("RESULT::authLogin", SOCKETRESULTauthLogin);
  //登録ができたと受信したときの処理
  socket.on("RESULT::authRegister", SOCKETRESULTauthRegister);

  console.log("/auth :: onMounted : session->", useCookie("session").value);

  //クッキーからセッションデータを取得、格納
  const sessionData = getSessionFromCookie();

  //クッキーがあればそのまま認証
  if (sessionData !== undefined) {
    //セッションIDをstoreへ登録
    updateSessionId(sessionData.sessionId);
    //ユーザーIDをあらかじめマージ
    const updateMyUserinfo = useMyUserinfo().updateMyUserinfo;
    updateMyUserinfo({
      ...useMyUserinfo().getMyUserinfo,
      userId: sessionData.userId,
    });

    //準備処理開始
    initialize(sessionData.userId, sessionData.sessionId);
  }
});

onUnmounted(() => {
  //socketハンドラ解除
  socket.off("authResult");
  socket.off("registerEnd");
});
</script>

<template>
  <div class="d-flex" style="height: 100vh; width: 100vw">
    <!-- カバー画像 -->
    <div class="instanceImage me-auto mr-n5">ここが画像になる</div>

    <!-- ログイン/登録用パネル -->
    <v-card class="panel pa-6 rounded-e-0 d-flex flex-column justify-center">
      <!-- Girackタイトル -->
      <p class="text-h4 text-center my-5">Girack</p>
      <!-- 認証結果の表示 -->
      <div>
        <v-alert
          v-if="resultDisplay === 'FAILED'"
          type="error"
          class="flex-shrink-1 flex-grow-0"
          style="min-height: max-content"
        >
          <v-alert-title>認証に失敗しました</v-alert-title>
        </v-alert>
      </div>
      <!-- ログイン/登録ボタン -->
      <div class="d-flex justify-center py-4">
        <m-btn
          @click="authMode = 'LOGIN'"
          class="mx-1"
          size="large"
          :color="authMode === 'LOGIN' ? 'primary' : null"
          :variant="authMode === 'LOGIN' ? 'tonal' : 'text'"
          >ログイン</m-btn
        >
        <m-btn
          @click="authMode = 'REGISTER'"
          :disabled="!getServerinfo.registration.available"
          class="mx-1"
          size="large"
          :color="authMode === 'REGISTER' ? 'primary' : null"
          :variant="authMode === 'REGISTER' ? 'tonal' : 'text'"
          >新規登録</m-btn
        >
      </div>
      <!-- 真ん中表示部分 -->
      <!-- ログイン部分 -->
      <div v-if="authMode === 'LOGIN'" class="d-flex flex-column">
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

  width: 100%;

  z-index: 50;
}

.panel {
  width: 35vw;
  min-width: 400px;
  max-width: 500px;

  border-radius: 28px 0 0 28px !important;

  background-color: rgb(var(--v-theme-background));

  z-index: 100;
}
</style>
