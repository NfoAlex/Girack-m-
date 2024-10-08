<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useServerinfo } from "~/stores/serverinfo";
import { useMyUserinfo } from "~/stores/userinfo";

const { getServerinfo } = storeToRefs(useServerinfo());
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const file = ref<File | null>(); //プロフィール画像ファイル入力用
const canUploadThis = ref<boolean>(false);
const stateUploading = ref<boolean>(false); //アップロード途中であるかどうか
const uploadResult = ref<"SUCCESS" | "ERROR" | null>(null);
const metadata = ref<{ userId: string; sessionId: string }>({
  //ユーザーIDとか格納用
  userId: getMyUserinfo.value.userId,
  sessionId: getSessionId.value,
});
const uploadRule = ref([
  //アップロードするファイルのサイズ制限確認
  (fileInput: File[]) => {
    try {
      //console.log("fileInput->", fileInput[0]);

      //条件で一度調べていけるなら画像アップロード許可状態を設定
      if (fileInput[0].size < getServerinfo.value.config.PROFILE.iconMaxSize)
        canUploadThis.value = true;

      return (
        fileInput[0].size < getServerinfo.value.config.PROFILE.iconMaxSize ||
        `画像サイズを${avatarLimitSizeHumanDisplay()}以下にしてください!`
      );
    } catch (e) {
      return true;
    }
  },
]);

/**
 * アイコンサイズの制限を読みやすい単位に変換
 */
const avatarLimitSizeHumanDisplay = () => {
  let realSize = getServerinfo.value.config.PROFILE.iconMaxSize;
  let countLevel = 0;
  const sizeDisplayLevel: {
    [key: number]: string;
  } = {
    0: "Byte",
    1: "KB",
    2: "MB",
    3: "GB",
    4: "TB",
  };
  //100で割っていって単位を割り出す
  while (realSize > 100) {
    countLevel++;
    realSize = realSize / 1000;
  }

  //表示結果を返す
  return realSize + sizeDisplayLevel[countLevel];
};

/**
 * プロフィール画像をアップロード
 */
const submit = async () => {
  //ファイルがあると処理をする
  if (file.value) {
    const formData = new FormData();

    //画像ファイルを格納
    formData.append("file", file.value);
    // JSONデータを文字列に変換して追加
    formData.append("metadata", JSON.stringify(metadata.value));

    //アップロード中と設定
    stateUploading.value = true;

    //画像アップロード(結果はHTTPリスポンス)
    const result = await fetch("/uploadProfileIcon", {
      method: "POST",
      body: formData,
    })
      .finally(() => {
        //console.log("/profile :: submit : アップロードが完了");
        //アップロード状態を解除
        stateUploading.value = false;
      })
      .catch((err: Error) => {
        console.log("/profile :: submit : アップロードエラー->", err);
        console.log("無理だったわ");
        uploadResult.value = "ERROR";

        return;
      });

    //結果がエラーだった時に処理
    if (!result?.ok) {
      uploadResult.value = "ERROR";
      return;
    }

    if (result.status === 200) {
      //console.log("/profile :: submit : result->", result);
      uploadResult.value = "SUCCESS";
    } else {
      //console.log("無理だったわ");
      uploadResult.value = "ERROR";
    }
    //console.log("/profile :: submit : resultJSON->", resultJSON);
  }
};
</script>

<template>
  <v-dialog
    style="max-width: 650px; width: 80vw"
  >

    <m-card v-if="uploadResult!=='SUCCESS'" :loading="stateUploading">
      <v-card-title>
        プロフィール画像を変更
      </v-card-title>
      <v-card-text>
        <v-file-input
          v-model="file"
          :multiple="false"
          accept="image/png, image/jpeg, image/gif"
          :rules="uploadRule"
          :label="'プロフィール画像(' + avatarLimitSizeHumanDisplay() + ')'"
        />
        <v-alert v-if="uploadResult==='ERROR'" type="error">
          ファイルアップロードがうまくいきませんでした
        </v-alert>
      </v-card-text>
      <v-card-actions class="d-flex flex-row-reverse">
        <m-btn
          @click="submit"
          :disabled="!canUploadThis || file === null"
          color="primary"
        >アップロード</m-btn>
      </v-card-actions>
    </m-card>

    <m-card v-if="uploadResult==='SUCCESS'">
      <v-card-title>
        プロフィール画像を変更
      </v-card-title>
      <v-card-text>
        <p>成功しました!</p>
      </v-card-text>
      <v-card-actions class="d-flex flex-row-reverse">
        <m-btn @click="$emit('close-dialog')">閉じる</m-btn>
      </v-card-actions>
    </m-card>

  </v-dialog>
</template>
