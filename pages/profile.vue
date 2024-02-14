<script setup lang="ts">
import { useMyUserinfo } from "../stores/userinfo";
import { setCookie } from "../composables/setCookie";
import { socket } from "../socketHandlers/socketInit";

const { getMyUserinfo } = storeToRefs(useMyUserinfo());
</script>

<script lang="ts">

//結果用type
type resultNewUsername = "SUCCESS" | "SHORT_NAME" | "ALREADY_USED" | "";
type resultNewUsernameAlertDisplay = "info" | "error" | "success";

export default {
  data() {
    return {
      //ダイアログ
      dialogLogout: false as boolean, //ログアウト確認
      dialogChangePassword: false as boolean, //パスワード変更
      dialogChangeUsername: false as boolean, //ユーザー名変更用
    }
  },
}

</script>

<template>

  <!-- ログアウト確認用ダイアログ -->
  <AuthLogout v-model="dialogLogout" @closeDialog="()=>{ dialogLogout=false }" />

  <!-- パスワード変更用ダイアログ -->
  <AuthChangePassword v-model="dialogChangePassword" @closeDialog="()=>{ dialogChangePassword=false }" />

  <!-- ユーザー名変更用ダイアログ -->
  <AuthChangeUsername v-model="dialogChangeUsername" @closeDialog="()=>{ dialogChangeUsername=false }" />

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
            <v-btn @click="()=>{ dialogChangeUsername=true }" rounded="lg" icon="" variant="text">
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