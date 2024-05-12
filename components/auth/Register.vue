<script setup lang="ts">
import { socket } from "../../socketHandlers/socketInit";

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
</script>

<template>
  <!-- 登録部分 -->
  <div class="d-flex flex-column">
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
</template>
