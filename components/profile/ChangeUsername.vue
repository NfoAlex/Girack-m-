<script setup lang="ts">
import { useMyUserinfo } from "../../stores/userinfo";
import { socket } from "../../socketHandlers/socketInit";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
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

      //ユーザー名検索中
      stateUsernameSearching: false as boolean,

      //結果受け取り用
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
          const sessionId = useMyUserinfo().getSessionId;
          //名前検索
          socket.emit("searchUserInfo", {
            RequestSender: {
              userid: MyUserinfo.userId,
              sessionid: sessionId
            },
            userName: this.newUsername
          });

        } else if (this.newUsername.length === 0) { //新ユーザー名が0なら初期化
          this.resultNewUsername = "";
          this.resultNewUsernameAlertDisplay = "info";
        } else {
          //エラー設定
          this.resultNewUsername = "SHORT_NAME";
          this.resultNewUsernameAlertDisplay = "error";
        }
        //表示する結果設定
        this.checkUsernameResultDisplay();
      }
    }
  },

  methods: {
    //ユーザー名を変更する
    changeUsername():void {
      //自ユーザー情報取得
      const MyUserinfo = useMyUserinfo().getMyUserinfo;
      const sessionId = useMyUserinfo().getSessionId;
      //名前更新
      socket.emit("changeProfile", {
        name: this.newUsername, //更新する名前
        targetid: MyUserinfo.userId, //対象ユーザーID(自分)
        reqSender: {
          //セッション認証に必要な情報送信
          userid: MyUserinfo.userId,
          sessionid: sessionId,
        },
      });

      //ダイアログを閉じる
      this.$emit('closeDialog');
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
    SOCKETsearchUserInfo(result:[{userid:string, username:string}]):void {
      console.log("profile :: SOCKETsearchUserInfo : result->", result);
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
    socket.on("RESULT::searchUserInfo", this.SOCKETsearchUserInfo);
  },

  unmounted() {
    //ハンドラ解除
    socket.off("RESULT::searchUserInfo", this.SOCKETsearchUserInfo);
  }
}

</script>

<template>
  <v-dialog
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
</template>
