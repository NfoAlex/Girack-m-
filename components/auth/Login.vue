<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
const { updateSessionId } = useMyUserinfo();

//emit用
const emitInitializeProxy = ():void => {
  emits("initialize", getMyUserinfo.value.userId, getSessionId.value)
};

/**
 * data
 */
const username = ref<string>("");
const password = ref<string>("");
const processingAuth = ref<boolean>(false); //ボタンの処理中表示用
const resultDisplay = ref<string>("");

//emit
const emits = defineEmits<{
  (e:"applyChangeUserName", username:string):void,
  (e: 'initialize', userId:string, sessionId:string): void
}>();

//prop
const props = defineProps<{
  sharedUserName: string
}>();

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

onMounted(() => {
  //認証結果受け取り
  socket.on("RESULT::authLogin", SOCKETRESULTauthLogin);
  //ユーザー名を適用
  username.value = props.sharedUserName;

  console.log("/auth :: onMounted : session->", useCookie("session").value);
});

onUnmounted(() => {
  //socketハンドラ解除
  socket.off("RESULT::authLogin", SOCKETRESULTauthLogin);
});
</script>

<template>
  <div class="d-flex flex-column">
    <v-text-field
      v-model="username"
      @change="emits('applyChangeUserName',username)"
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
    <div class="mt-3">
      <v-alert
        v-if="resultDisplay === 'FAILED'"
        type="error"
        class=""
        style="min-height: max-content"
        width="100%"
        variant="tonal"
      >
        <v-alert-title>認証に失敗しました</v-alert-title>
      </v-alert>
    </div>
  </div>
</template>
