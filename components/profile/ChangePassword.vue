<script setup lang="ts">
import { socket } from "../../socketHandlers/socketInit";
import { useMyUserinfo } from "../../stores/userinfo";

const { getMyUserinfo } = storeToRefs(useMyUserinfo());

/**
 * data
 */
// text-field用
const currentPassword = ref<string>("");
const newPassword = ref<string>("");
const newPasswordAgain = ref<string>("");
// 表示する結果用
const resultChangePasswordSuccess = ref<boolean>(false);
const resultChangePasswordError = ref<boolean>(false);

/**
 * パスワードを変更
 */
const changePassword = () => {
  //自ユーザー情報取得
  const MyUserinfo = useMyUserinfo().getMyUserinfo;
  //セッションID
  const sessionId = useMyUserinfo().getSessionId;
  //パスワードを変更申請
  socket.emit("changePassword", {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
    RequestSender: {
      userId: MyUserinfo.userId,
      sessionId: sessionId,
    },
  });
};

/**
 * パスワード変更結果受け取り用
 * @param dat
 */
const SOCKETchangePassword = (dat: { result: string; data: null }) => {
  console.log("ChangePassword :: SOCKETchangePassword : dat->", dat);
  if (dat.result === "SUCCESS") {
    resultChangePasswordSuccess.value = true;
  } else if (dat.result === "ERROR_WRONGPASSWORD") {
    resultChangePasswordError.value = true;
  }
};

onMounted(() => {
  socket.on("RESULT::changePassword", SOCKETchangePassword);
});

onUnmounted(() => {
  socket.off("RESULT::changePassword", SOCKETchangePassword);
});
</script>

<template>
  <!-- パスワード変更用ダイアログ -->
  <v-dialog
    style="max-width: 650px; width: 80vw"
  >
    <!-- パスワード変更前 -->
    <m-card v-if="!resultChangePasswordSuccess">

      <v-card-title>
        パスワード変更
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="currentPassword"
          variant="outlined"
          label="現在のパスワード"
          prepend-inner-icon="mdi:mdi-lock"
          class="mb-4"
          counter
          persistent-counter
          type="password"
        ></v-text-field>
        <v-text-field
          v-model="newPassword"
          variant="outlined"
          label="新しいパスワード"
          prepend-inner-icon="mdi:mdi-key"
          :error-messages="newPassword.length!==0&&newPassword.length<=8?'パスワードは8文字以上にしてください':null"
          class="mb-2"
          type="password"
        ></v-text-field>
        <v-text-field
          v-model="newPasswordAgain"
          variant="outlined"
          label="新しいパスワード確認"
          type="password"
        ></v-text-field>

        <!-- エラー用アラート -->
        <v-alert
          v-if="resultChangePasswordError"
          type="error"
          rounded="xl"
          class="mb-1"
        >
          現在のパスワードで認証ができませんでした
        </v-alert>
        <v-alert
          v-if="newPasswordAgain!==newPassword&&newPasswordAgain.length!==0"
          type="warning"
          rounded="xl"
        >設定する新パスワードが一致しません
        </v-alert>
      </v-card-text>

      <v-card-actions class="d-flex flex-row-reverse">
        <m-btn
          @click="changePassword"
          :disabled="newPasswordAgain!==newPassword&&newPasswordAgain.length!==0"
          color="primary"
        >変更する</m-btn>
      </v-card-actions>

    </m-card>
    <!-- 変更後 -->
    <m-card v-else>
      <v-card-title>
        確認
      </v-card-title>

      <v-card-text>
        パスワードの変更が完了しました
      </v-card-text>

      <v-card-actions class="d-flex flex-row-reverse">
        <m-btn
          @click="$emit('closeDialog')"
          variant="text"
        >閉じる</m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>
</template>
