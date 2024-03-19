<script setup lang="ts">
import { useMyUserinfo } from "../stores/userinfo";
import getMyRolePower from "~/composables/getMyRolePower";
import calcMyRole from "~/composables/calcMyRole";

const { getMyUserinfo } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const dialogLogout = ref<boolean>(false); //ログアウト確認
const dialogChangePassword = ref<boolean>(false); //パスワード変更
const dialogChangeUsername = ref<boolean>(false); //ユーザー名変更用
const dialogChangeProfileIcon = ref<boolean>(false); //プロフィール画像変更用
const myRolePower = ref<{ //自分の権力用
  ServerManage: boolean,
  RoleManage: boolean,
  ChannelRename: boolean,
  ChannelViewPrivate: boolean,
  ChannelCreateAndDelete: boolean,
  UserManage: boolean,
  MessageDelete: boolean,
  MessageAttatchFile: boolean
}>({
  ServerManage: false,
  RoleManage: false,
  ChannelRename: false,
  ChannelViewPrivate: false,
  ChannelCreateAndDelete: false,
  UserManage: false,
  MessageDelete: false,
  MessageAttatchFile: false
});

onMounted(() => {
  //現在の自分の権力を調べて格納
  myRolePower.value = getMyRolePower();

  //自分の情報の更新があったら権力をまた調べる
  watch(getMyUserinfo, () => {
    myRolePower.value = getMyRolePower();
  });
});

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

  <ProfileChangeProfileIcon
    v-model="dialogChangeProfileIcon"
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
        <div @click="dialogChangeProfileIcon = true">
          <v-img
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
          <div>
            <RoleChip
              v-for="roleId of getMyUserinfo.role"
              :roleId="roleId"
            />
          </div>
        </div>
        
      </div>

      <v-divider class="my-3"></v-divider>

      <div class="d-flex flex-column">
        <p class="text-h6 mb-1">あなたの権限</p>
        <m-card color="cardInner">
          あなたの権限レベル : <b> {{ calcMyRole() }} </b>
        </m-card>
        <m-card class="d-flex flex-column my-1" color="cardInner">

          <span>
            サーバーの管理 : 
            <v-icon v-if="myRolePower.ServerManage" color="success">mdi-check</v-icon>
            <v-icon v-else>mdi-close</v-icon>
          </span>
          <span>
            ロールの管理 : 
            <v-icon v-if="myRolePower.RoleManage" color="success">mdi-check</v-icon>
            <v-icon v-else>mdi-close</v-icon>
          </span>

          <v-divider class="my-2" />

          <span>
            チャンネル名の変更 : 
            <v-icon v-if="myRolePower.ChannelRename" color="success">mdi-check</v-icon>
            <v-icon v-else>mdi-close</v-icon>
          </span>
          <span>
            プライベートチャンネルの閲覧 : 
            <v-icon v-if="myRolePower.ChannelViewPrivate" color="success">mdi-check</v-icon>
            <v-icon v-else>mdi-close</v-icon>
          </span>
          <span>
            チャンネルの作成と削除 : 
            <v-icon v-if="myRolePower.ChannelCreateAndDelete" color="success">mdi-check</v-icon>
            <v-icon v-else>mdi-close</v-icon>
          </span>

          <v-divider class="my-2" />

          <span>
            ユーザーの管理 : 
            <v-icon v-if="myRolePower.UserManage" color="success">mdi-check</v-icon>
            <v-icon v-else>mdi-close</v-icon>
          </span>

          <v-divider class="my-2" />

          <span>
            他人のメッセージの削除 : 
            <v-icon v-if="myRolePower.MessageDelete" color="success">mdi-check</v-icon>
            <v-icon v-else>mdi-close</v-icon>
          </span>
          <span>
            メッセージへのファイル添付 : 
            <v-icon v-if="myRolePower.MessageAttatchFile" color="success">mdi-check</v-icon>
            <v-icon v-else>mdi-close</v-icon>
          </span>

        </m-card>
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
