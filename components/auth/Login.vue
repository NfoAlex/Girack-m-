<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useConfig } from "~/stores/config";
import { useAppStatus } from "~/stores/AppStatus";
import { useMyUserinfo } from "~/stores/userinfo";

const router = useRouter();

const { getAppStatus } = storeToRefs(useAppStatus());
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { updateSessionId } = useMyUserinfo();

//emit用
const emit = defineEmits<{
  (e: 'initialize', userId:string, sessionId:string): void
}>();
const emitInitializeProxy = ():void => {
  emit("initialize", getMyUserinfo.value.userId, getSessionId.value)
};

/**
 * data
 */
const username = ref<string>("");
const password = ref<string>("");
const processingAuth = ref<boolean>(false); //ボタンの処理中表示用
const resultDisplay = ref<string>("");

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
    //initialize(dat.data.UserInfo.userId, dat.data.sessionId);
    emitInitializeProxy();
  } else {
    //エラーを表示
    resultDisplay.value = "FAILED";
  }
  //認証状態中を解除
  processingAuth.value = false;
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
    //initialize(getMyUserinfo.value.userId, getSessionId.value);
    emitInitializeProxy();
  }
};

onMounted(() => {
  //認証結果受け取り
  socket.on("RESULT::authLogin", SOCKETRESULTauthLogin);
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
  socket.off("RESULT::authLogin", SOCKETRESULTauthLogin);
  socket.off("RESULT::authSession", SOCKEtauthSession);
});
</script>

<template>
  <div class="d-flex flex-column">
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
  </div>
</template>
