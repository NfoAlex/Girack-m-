<script setup lang="ts">
import { socket } from "../../socketHandlers/socketInit";
import { useServerinfo } from "~/stores/serverinfo";

import type { MyUserinfo } from "~/types/user";

const { getServerinfo } = storeToRefs(useServerinfo());

/**
 * data
 */
const processingAuth = ref<boolean>(false); //ボタンの処理中表示用
// text-field用
const username = ref<string>("");
const invitecode = ref<string>("");
// 結果用
const resultDisplay = ref<string>("");
const resultRegisterDone = ref<boolean>(false);
const passwordRegistered = ref<string>("");

//emit
const emits = defineEmits<{
  (e:"applyChangeUserName", username:string):void,
  (e:"registered", username:string):void
}>();

//prop
const props = defineProps<{
  sharedUserName: string
}>();

/**
 * ユーザー名の変更監視
 */
const applyChangeUserName = () => {
  emits("applyChangeUserName", username.value);
}

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
    emits("registered", username.value); //登録したと親へ伝える
  } else {
    resultDisplay.value = "FAILED";
    resultRegisterDone.value = false; //結果成功ととして表示
  }

  //認証状態中を解除
  processingAuth.value = false;
};

onMounted(() => {
  //登録ができたと受信したときの処理
  socket.on("RESULT::authRegister", SOCKETRESULTauthRegister);

  //ユーザー名を適用
  username.value = props.sharedUserName;
});

onUnmounted(() => {
  //socketハンドラ解除
  socket.off("RESULT::authRegister", SOCKETRESULTauthRegister);
});
</script>

<template>
  <!-- 登録部分 -->
  <div class="d-flex flex-column">
    <!-- 登録前 -->
    <div v-if="!resultRegisterDone">
      <v-text-field
        v-model="username"
        @change="applyChangeUserName"
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
</template>
