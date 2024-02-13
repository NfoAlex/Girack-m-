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
      //入力値系
      newUsername: "" as string,
      currentPassword: "" as string,
      newPassword: "" as string,
      newPasswordAgain: "" as string,
      
      //ダイアログ
      dialogLogout: false as boolean, //ログアウト確認
      dialogChangePassword: false as boolean, //パスワード変更

      //結果受け取り用
      resultChangePasswordSuccess: false as boolean
    }
  },

  methods: {
    //ログアウト処理
    logout():void {
      const MyUserinfo = useMyUserinfo().getMyUserinfo;
      //クッキー削除
      setCookie("session", "", 0);
      //ログアウトするとサーバーへ通達
      socket.emit("logout", {
        targetSessionid: MyUserinfo.sessionid,
        reqSender: {
          userid: MyUserinfo.userid,
          sessionid: MyUserinfo.sessionid,
        },
      });
      location.reload(); //ページリロード
    },

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
    },
  }
}

</script>

<template>

  <!-- ログアウト確認用ダイアログ -->
  <v-dialog
    v-model="dialogLogout"
    style="max-width: 750px; width: 85vw"
  >
    <m-card>
      <v-card-title>
        確認
      </v-card-title>
      <v-card-text>
        ログアウトします。よろしいですか？
      </v-card-text>
      <v-card-actions class="d-flex flex-row-reverse">
        <m-btn
          @click="logout"
          color="error"
        >ログアウトする</m-btn>
        <m-btn
          @click="()=>{ dialogLogout=false }"
          class="mx-1"
          variant="text"
        >キャンセル</m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>

  <!-- パスワード変更用ダイアログ -->
  <v-dialog
    v-model="dialogChangePassword"
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
        ></v-text-field>
        <v-text-field
          v-model="newPassword"
          variant="outlined"
          label="新しいパスワード"
          prepend-inner-icon="mdi:mdi-key"
          :error-messages="newPassword.length<=8?'パスワードは8文字以上にしてください':null"
          class="mb-2"
        ></v-text-field>
        <v-text-field
          v-model="newPasswordAgain"
          variant="outlined"
          label="新しいパスワード確認"
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
          size="large"
        >変更する</m-btn>
      </v-card-actions>

    </m-card>
    <!-- 完了後 -->
    <m-card v-else>
      <v-card-title>
        確認
      </v-card-title>
      <v-card-text>
        完了しました
      </v-card-text>
    </m-card>
  </v-dialog>

  <div class="pa-4">
    <p class="text-h5 pa-2">あなた</p>
    <v-divider class="my-2"></v-divider>
    <m-card class="mx-auto" width="80%" style="max-width:600px;">

      <div class="d-flex justify-start" style="width:100%;">

        <!-- アイコン -->
        <div>
          <v-img
            @click=""
            :alt="getMyUserinfo.userid"
            :src="'/img/' + getMyUserinfo.userid"
            width="100"
          ></v-img>
        </div>

        <!-- ユーザー名 -->
        <div class="d-flex flex-column justify-center align-self-stretch px-4" style="width:100%;">
          <p class="text-disabled text-h6">
            ID : {{ getMyUserinfo.userid }}
          </p>
          <div class="d-flex align-center align-self-stretch">
            <p class="text-h4 text-truncate me-auto">
              {{ getMyUserinfo.username }}
            </p>
            <v-btn rounded="lg" icon="" variant="text">
              <v-icon>mdi:mdi-pencil</v-icon>
            </v-btn>
          </div>
        </div>

      </div>

      <v-divider class="my-3"></v-divider>
      
      <div>
        <m-btn @click="()=>{ dialogChangePassword=true }" color="primary" block class="my-2">パスワードを変更</m-btn>
        <m-btn @click="()=>{ dialogLogout=true }" color="red" block class="mt-2">ログアウトする</m-btn>
      </div>

    </m-card>
    
  </div>
</template>