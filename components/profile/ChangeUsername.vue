<script setup lang="ts">
import type { MyUserinfo } from "~/types/user";
import { socket } from "../../socketHandlers/socketInit";
import { useMyUserinfo } from "../../stores/userinfo";

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

//結果用type
type TresultNewUsername = "SUCCESS" | "SHORT_NAME" | "ALREADY_USED" | "";
type TresultNewUsernameAlertDisplay = "info" | "error" | "success";

/**
 * data
 */
// 新ユーザー名入力用
const newUsername = ref<string>("");
// ユーザー検索中かどうか
const stateUsernameSearching = ref<boolean>(false);
// 結果保存用
const resultNewUsername = ref<TresultNewUsername>("");
const resultNewUsernameAlertDisplay =
  ref<TresultNewUsernameAlertDisplay>("info");

/**
 * emit
 */
const emit = defineEmits(["closeDialog"]);

/**
 * watch
 * 新ユーザー名の変更監視して使えるかを調べる
 */
watch(newUsername, () => {
  //２文字以上ならトリガー
  if (newUsername.value.length >= 2) {
    //ユーザー名検索中と設定
    stateUsernameSearching.value = true;
    resultNewUsernameAlertDisplay.value = "info";
    //自ユーザー情報情報取得
    const MyUserinfo = useMyUserinfo().getMyUserinfo;
    const sessionId = useMyUserinfo().getSessionId;
    //名前検索
    socket.emit("searchUserInfo", {
      RequestSender: {
        userId: MyUserinfo.userId,
        sessionId: sessionId,
      },
      userName: newUsername.value,
      rule: "FULL",
    });
  } else if (newUsername.value.length === 0) {
    //新ユーザー名が0なら初期化
    resultNewUsername.value = "";
    resultNewUsernameAlertDisplay.value = "info";
  } else {
    //エラー設定
    resultNewUsername.value = "SHORT_NAME";
    resultNewUsernameAlertDisplay.value = "error";
  }
  //表示する結果設定
  checkUsernameResultDisplay();
});

/**
 * ユーザー名を変更する
 */
const changeUsername = () => {
  //自ユーザー情報取得
  const MyUserinfo = useMyUserinfo().getMyUserinfo;
  const sessionId = useMyUserinfo().getSessionId;
  //名前更新
  socket.emit("changeUserName", {
    userName: newUsername.value, //更新する名前
    RequestSender: {
      //セッション認証に必要な情報送信
      userId: MyUserinfo.userId,
      sessionId: sessionId,
    },
  });

  //ダイアログを閉じる
  emit("closeDialog");
};

/**
 * ユーザー名が使えるかどうかのVAlert用の表示ラベルを返す
 */
const checkUsernameResultDisplay = () => {
  switch (resultNewUsername.value) {
    case "ALREADY_USED":
      resultNewUsernameAlertDisplay.value = "error";
      break;

    case "SUCCESS":
      resultNewUsernameAlertDisplay.value = "success";
      break;

    case "SHORT_NAME":
      resultNewUsernameAlertDisplay.value = "error";
      break;

    default:
      resultNewUsernameAlertDisplay.value = "info";
      break;
  }
};

/**
 * ユーザー名変更用の名前検索ハンドラ
 * @param result
 */
const SOCKETsearchUserInfo = (result: {
  result: string;
  data: [MyUserinfo];
}) => {
  console.log("profile :: SOCKETsearchUserInfo : result->", result);
  //結果を一つずつ調べる
  for (const index in result.data) {
    //名前が検索結果にあったら
    if (result.data[index].userName === newUsername.value) {
      //この名前を使えないと設定
      resultNewUsername.value = "ALREADY_USED";
      //検索中状態を解除
      stateUsernameSearching.value = false;
      //表示する結果設定
      checkUsernameResultDisplay();

      return;
    }
  }

  //検索中状態を解除
  stateUsernameSearching.value = false;

  //この名前を使えると設定
  resultNewUsername.value = "SUCCESS";
  //表示する結果設定
  checkUsernameResultDisplay();
};

onMounted(() => {
  //ユーザー検索結果受け取り用
  socket.on("RESULT::searchUserInfo", SOCKETsearchUserInfo);
});

onUnmounted(() => {
  //ハンドラ解除
  socket.off("RESULT::searchUserInfo", SOCKETsearchUserInfo);
});
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
          variant="tonal"
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
