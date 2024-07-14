<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const fileItems = ref<any[]>([]);
const elFileInput = ref(null); //入力欄要素を取得するためのref
const displayUpload = ref<boolean>(false);

/**
 * ファイルの入力を受け取る
 */
const fileInput = () => {
  if (elFileInput.value === null) return;

  //ファイルデータを初期化
  fileItems.value = [];

  console.log("filePortal :: fileInput : ファイルデータ->",
    elFileInput.value.files[0].size < 1,
    elFileInput.value.files[0].size === undefined
  );

  //inputに入力されたファイルの数ぶん処理する
  for (let index in elFileInput.value.files) {
    //条件を調べる
    if (
      elFileInput.value.files[index].size < 1 ||
      elFileInput.value.files[index].size === undefined
    ) {
      console.log("filePortal :: fileInput : ファイル入力エラー");
    } else {
      //ファイルデータ用配列へファイルデータを追加
      fileItems.value.push(elFileInput.value.files[index]);
      console.log("filePortal :: fileInput : fileItems->", fileItems.value);
    }
  }

  displayUpload.value = true;
}

/**
 * ファイルをアップロードする
 */
const uploadFiles = async () => {
  const RequestSenderInString = JSON.stringify({
      userId: getMyUserinfo.value.userId,
      //sessionId: getSessionId.value
      sessionId: "asdf"
    });

  for (let fileIndex in fileItems.value) {
    //アップロードするデータフォームオブジェクト生成
    const formData = new FormData();
    // JSONデータを文字列に変換して追加
    formData.append('metadata', RequestSenderInString);
    //ファイルそのものを内包
    formData.append('file', fileItems.value[fileIndex]);

    //ファイルをアップロード(結果はHTTPリスポンス)
    const result:Response|void = await fetch('/uploadfile', {
      method: 'POST',
      body: formData
    }).finally(() => {
      console.log("filePortal :: uploadFiles(/uploadfile) : アップロード終わり");
    }).catch((err:Error) => {
      console.log("filePortal :: uploadFiles(/uploadfile) : アップロードエラー->", err);
    });
    console.log("filePortal :: uploadFiles(/uploadfile) : result->", result);
  }

}

/**
 * アップロード画面を呼び出し
 */
const clickUpload = () => {
  if (elFileInput !== null) {
    document.getElementById("elFileInput")?.click();
  }
}

</script>

<template>
  <v-dialog
    v-model="displayUpload"
    style="max-width: 750px; width: 85vw"
  >
    <m-card>
      <v-card-title>
        ファイルアップロード
      </v-card-title>
      <v-card-text>
        ファイルをアップロードします
      </v-card-text>
      <v-card-actions>
        <m-btn
          @click="uploadFiles"
          color="primary"
        >
          アップロードする
        </m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>

  <div class="pt-5 px-5 d-flex flex-column" style="height:100%;">
    <span class="d-flex align-center">
      <p
        class="text-h5"
        style="font-weight:700;"
      >ファイルポータル</p>
    </span>
    <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />
  </div>

  <!-- ファイル受け取り部分(非表示) -->
  <input
    @change="fileInput"
    type="file"
    id="elFileInput"
    ref="elFileInput"
    style="display: none"
    multiple
  />

  <!-- アップロードボタン -->
  <v-btn
    @click="clickUpload"
    position="absolute"
    style="right:5%; bottom: 5%;"
    color="primary"
    icon="mdi:mdi-plus"
    size="x-large"
    rounded="lg"
  />
</template>