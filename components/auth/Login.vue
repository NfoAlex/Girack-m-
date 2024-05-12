<script setup lang="ts">
import { socket } from "../../socketHandlers/socketInit";

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
