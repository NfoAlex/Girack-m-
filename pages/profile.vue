<script setup lang="ts">
import { useMyUserinfo } from "../stores/userinfo";

const { getMyUserinfo } = storeToRefs(useMyUserinfo());

// ダイアログ
const dialogLogout = ref<boolean>(false); //ログアウト確認
const dialogChangePassword = ref<boolean>(false); //パスワード変更
const dialogChangeUsername = ref<boolean>(false); //ユーザー名変更用
</script>

<template>
  <!-- ログアウト確認用ダイアログ -->
  <ProfileLogout
    v-model="dialogLogout"
    @closeDialog="
      () => {
        dialogLogout = false;
      }
    "
  />

  <!-- パスワード変更用ダイアログ -->
  <ProfileChangePassword
    v-model="dialogChangePassword"
    @closeDialog="
      () => {
        dialogChangePassword = false;
      }
    "
  />

  <!-- ユーザー名変更用ダイアログ -->
  <ProfileChangeUsername
    v-model="dialogChangeUsername"
    @closeDialog="
      () => {
        dialogChangeUsername = false;
      }
    "
  />

  <div class="pa-4">
    <p class="text-h5 pa-2">あなた</p>
    <v-divider class="my-2"></v-divider>
    <m-card class="mx-auto" width="80%" style="max-width: 600px">
      <div class="d-flex justify-start" style="width: 100%">
        <!-- アイコン -->
        <div>
          <v-img
            @click=""
            :alt="getMyUserinfo.userId"
            :src="'/img/' + getMyUserinfo.userId"
            width="100"
          ></v-img>
        </div>

        <!-- ユーザー名 -->
        <div
          class="d-flex flex-column justify-center align-self-stretch px-4"
          style="width: 100%"
        >
          <p class="text-disabled text-h6">ID : {{ getMyUserinfo.userId }}</p>
          <div class="d-flex align-center align-self-stretch">
            <p class="text-h4 text-truncate me-auto">
              {{ getMyUserinfo.userName }}
            </p>
            <v-btn
              @click="
                () => {
                  dialogChangeUsername = true;
                }
              "
              rounded="lg"
              icon=""
              variant="text"
            >
              <v-icon>mdi:mdi-pencil</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <v-divider class="my-3"></v-divider>

      <div>
        <m-btn
          @click="
            () => {
              dialogChangePassword = true;
            }
          "
          color="primary"
          block
          class="my-2"
          >パスワードを変更</m-btn
        >
        <m-btn
          @click="
            () => {
              dialogLogout = true;
            }
          "
          color="red"
          block
          class="mt-2"
          >ログアウトする</m-btn
        >
      </div>
    </m-card>
  </div>
</template>
