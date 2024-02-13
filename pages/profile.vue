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
      //入力値系
      newUsername: "" as string,
      currentPassword: "" as string,
      newPassword: "" as string,
      newPasswordAgain: "" as string,
      
      //ダイアログ
      dialogLogout: false as boolean, //ログアウト確認
      dialogChangePassword: false as boolean, //パスワード変更
      dialogChangeUsername: false as boolean, //ユーザー名変更用

      //ユーザー名検索中
      stateUsernameSearching: false as boolean,

      //結果受け取り用
      resultChangePasswordSuccess: false as boolean, //パスワードの変更結果用
      resultNewUsername: "" as resultNewUsername, //ユーザー名の検索結果
      resultNewUsernameAlertDisplay: "info" as resultNewUsernameAlertDisplay, //ユーザー名の検索結果表示用
    }
  },

  watch: {
    //新ユーザー名の入力監視
    newUsername: {
      handler() {
        //２文字以上ならトリガー
        if (this.newUsername.length >= 2) {
          //ユーザー名検索中と設定
          this.stateUsernameSearching = true;
          this.resultNewUsernameAlertDisplay = "info";
          //自ユーザー情報情報取得
          const MyUserinfo = useMyUserinfo().getMyUserinfo;
          //名前検索
          socket.emit("searchUserDynamic", {
            query: this.newUsername,
            reqSender: {
              userid: MyUserinfo.userid,
              sessionid: MyUserinfo.sessionid
            }
          });

        } else if (this.newUsername.length === 0) {
          this.resultNewUsername = "";
        } else {
          //結果初期化
          this.resultNewUsername = "SHORT_NAME";
        }
        //表示する結果設定
        this.checkUsernameResultDisplay();
      }
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
      //パスワードを変更したと設定
      this.resultChangePasswordSuccess = true;
    },

    //ユーザー名を変更する
    changeUsername():void {
      //自ユーザー情報取得
      const MyUserinfo = useMyUserinfo().getMyUserinfo;
      //名前更新
      socket.emit("changeProfile", {
        name: this.newUsername, //更新する名前
        targetid: MyUserinfo.userid, //対象ユーザーID(自分)
        reqSender: {
          //セッション認証に必要な情報送信
          userid: MyUserinfo.userid,
          sessionid: MyUserinfo.sessionid,
        },
      });
    },

    //ユーザー名が使えるかどうかのVAlert用の表示ラベルを返す
    checkUsernameResultDisplay():void {
      switch(this.resultNewUsername) {
        case "ALREADY_USED":
          this.resultNewUsernameAlertDisplay = "error";
          break;

        case "SUCCESS":
          this.resultNewUsernameAlertDisplay = "success";
          break;

        case "SHORT_NAME":
          this.resultNewUsernameAlertDisplay = "error";
          break;

        default:
          this.resultNewUsernameAlertDisplay = "info";
          break;
      }
    },

    //ユーザー名変更用の名前検索ハンドラ
    SOCKETinfoSearchUser(result:[{userid:string, username:string}]) {
      console.log("profile :: SOCKETinfoSerchUser : result->", result);
      //結果を一つずつ調べる
      for (let index in result) {
        //名前が検索結果にあったら
        if (result[index].username === this.newUsername) {
          //この名前を使えないと設定
          this.resultNewUsername = "ALREADY_USED";
          //検索中状態を解除
          this.stateUsernameSearching = false;
          //表示する結果設定
          this.checkUsernameResultDisplay();

          return;
        }
      }

      //検索中状態を解除
      this.stateUsernameSearching = false;

      //この名前を使えると設定
      this.resultNewUsername = "SUCCESS";
      //表示する結果設定
      this.checkUsernameResultDisplay();
    }
  },

  mounted() {
    //ユーザー検索結果受け取り用
    socket.on("infoSearchUser", this.SOCKETinfoSearchUser);
  },

  unmounted() {
    //ハンドラ解除
    socket.off("infoSearchUser", this.SOCKETinfoSearchUser);
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
          :error-messages="newPassword.length!==0&&newPassword.length<=8?'パスワードは8文字以上にしてください':null"
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
          @click="()=>{ dialogChangePassword=false }"
          variant="text"
        >閉じる</m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>

  <!-- ユーザー名変更用ダイアログ -->
  <v-dialog
    v-model="dialogChangeUsername"
    style="max-width: 650px; width: 80vw"
  >
    <m-card :loading="stateUsernameSearching">

      <v-card-title>
        ユーザー名の変更
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="newUsername"
          label="新ユーザー名"
        >
        </v-text-field>
        <!-- 結果表示 -->
        <v-alert
          :type="resultNewUsernameAlertDisplay"
        >
          <p v-if="stateUsernameSearching">検索中...</p>
          <span v-else>
            <p v-if="resultNewUsername===''">ユーザー名を入力してください</p>
            <p v-if="resultNewUsername==='SHORT_NAME'">ユーザー名は2文字以上入力してください</p>
            <p v-if="resultNewUsername==='ALREADY_USED'">このユーザー名は既に使用されています</p>
            <p v-if="resultNewUsername==='SUCCESS'">使えます</p>
          </span>
        </v-alert>
      </v-card-text>

      <v-card-actions class="d-flex flex-row-reverse">
        <m-btn
          @click="changeUsername"
          :disabled="resultNewUsername!=='SUCCESS'||stateUsernameSearching"
          color="primary"
        >変更する</m-btn>
      </v-card-actions>

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