<script setup lang="ts">
import { useMyUserinfo } from "../stores/userinfo";
import { setCookie } from "../composables/setCookie";
import { socket } from "../socketHandlers/socketInit";

const { getMyUserinfo } = storeToRefs(useMyUserinfo());
</script>

<script lang="ts">

export default {
  data() {
    return {
      currentPassword: "" as string,
      newPassword: "" as string,
      newPasswordAgain: "" as string,

      resultChangePasswordSuccess: false as boolean
    }
  },

  methods: {
    //パスワードを変更
    changePassword():void {
      //自ユーザー情報取得
      const MyUserinfo = useMyUserinfo().getMyUserinfo;
      //パスワードを変更申請
      socket.emit("changePassword", {
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        reqSender: {
          userid: MyUserinfo.userid,
          sessionid: MyUserinfo.sessionid,
        },
      });
      //パスワードを変更したと設定
      this.resultChangePasswordSuccess = true;
    },
  }
}

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
          v-if="newPasswordAgain!==newPassword&&newPasswordAgain.length!==0"
          type="error"
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