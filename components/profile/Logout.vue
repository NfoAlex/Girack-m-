<script setup lang="ts">
import { useMyUserinfo } from "../../stores/userinfo";
import { setCookie } from "../../composables/setCookie";
import { socket } from "../../socketHandlers/socketInit";

const { getMyUserinfo } = storeToRefs(useMyUserinfo());

/**
 * ログアウト処理
 */
const logout = () => {
  //クッキー削除
  setCookie("session", "", 0);
  //ページリロード
  location.reload();
}

</script>

<template>

  <!-- ログアウト確認用ダイアログ -->
  <v-dialog
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
          @click="$emit('closeDialog')"
          class="mx-1"
          variant="text"
        >キャンセル</m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>

</template>
