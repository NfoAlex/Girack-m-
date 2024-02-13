<script setup lang="ts">
import { useMyUserinfo } from "../stores/userinfo";
import { setCookie } from "../composables/setCookie";
import { socket } from "../socketHandlers/socketInit";

const { getMyUserinfo } = storeToRefs(useMyUserinfo());
</script>

<script lang="ts">

  methods: {
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
    }
  }
}

</script>

<template>
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
        <m-btn color="primary" block class="my-2">パスワードを変更</m-btn>
        <m-btn @click="logout" color="red" block class="mt-2">ログアウトする</m-btn>
      </div>

    </m-card>
    
  </div>
</template>