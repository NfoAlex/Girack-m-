<script setup lang="ts">
import { socket } from "../socketHandlers/socketInit";
import { useServerinfo } from "../stores/serverinfo";
import { useMyUserinfo } from "../stores/userinfo";
import { useConfig } from "../stores/config";
import { useAppStatus } from "../stores/AppStatus";

const { getServerinfo } = storeToRefs(useServerinfo());
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { getAppStatus } = storeToRefs(useAppStatus());
const { updateSessionId } = useMyUserinfo();

const router = useRouter();

definePageMeta({
  layout: "plain", //レイアウトを何もないやつに設定
});

/**
 * data
 */
const authMode = ref<"LOGIN"|"REGISTER">("LOGIN"); // "LOGIN" | "REGISTER"

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

  //ログイン状態を完了と設定
  getAppStatus.value.profile.authDone = true;

  //トップページへ移動
  router.push("/");
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
 * セッション認証結果の受け取り
 * @param dat
 */
const SOCKEtauthSession = (dat:{result:string, dat:boolean}) => {
  console.log("/auth :: SOCKETauthSession : dat->", dat);

  //成功なら初期ロード開始
  if (dat.result === "SUCCESS") {
    //ロード開始
    initialize(getMyUserinfo.value.userId, getSessionId.value);
  }
};

onMounted(() => {
  //認証結果受け取り
  socket.on("RESULT::authSession", SOCKEtauthSession);

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

    //セッション認証
    socket.emit("authSession", {
      userId: sessionData.userId,
      sessionId: sessionData.sessionId
    });
  }
});

onUnmounted(() => {
  //socketハンドラ解除
  socket.off("RESULT::authSession", SOCKEtauthSession);
});
</script>

<template>
  <div class="d-flex" style="height: 100%; width: 100vw">
    <!-- カバー画像 -->
    <div class="instanceImage me-auto mr-n5">ここが画像になる</div>

    <!-- ログイン/登録用パネル -->
    <v-card class="panel pa-6 rounded-e-0 d-flex flex-column justify-center">
      <!-- Girackタイトル -->
      <p class="text-h4 text-center my-5">Girack</p>
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
      <AuthLogin v-if="authMode === 'LOGIN'" @initialize="initialize" />
      <AuthRegister v-if="authMode === 'REGISTER'" />
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
