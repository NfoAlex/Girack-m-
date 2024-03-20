<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
import { useServerinfo } from "~/stores/serverinfo";

const { getServerinfo } = storeToRefs(useServerinfo());
const { getMyUserinfo } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const file = ref<any>();
const metadata = ref<{userId:string}>({
  userId: getMyUserinfo.value.userId
});

/**
 * アイコンサイズの制限を読みやすい単位に変換
 */
const avatarLimitSizeHumanDisplay = computed(() => {
  let realSize = getServerinfo.value.config.PROFILE.iconMaxSize;
  let countLevel = 0;
  const sizeDisplayLevel:{
    [key:number]: string
  } = {
    0: "Byte",
    1: "KB",
    2: "MB",
    3: "GB",
    4: "TB"
  };
  //100で割っていって単位を割り出す
  while (realSize > 100) {
    countLevel++;
    realSize = realSize / 1000;
  }

  //表示結果を返す
  return realSize + sizeDisplayLevel[countLevel];

});

/**
 * プロフィール画像をアップロード
 */
const submit = async () => {
  if (file.value) {
    const formData = new FormData();
    formData.append('file', file.value[0]);
    // JSONデータを文字列に変換して追加
    formData.append('metadata', JSON.stringify(metadata.value));

    //画像アップロード
    fetch('/uploadProfileIcon', {
      method: 'POST',
      body: formData
    }).finally(() => {
      console.log("/profile :: submit : アップロードが完了");
    })
    .catch((err:Error) => {
      console.log("/profile :: submit : アップロードエラー->", err);
    });

    //console.log("/profile :: submit : r->", r);
  }
}
</script>

<template>
  <v-dialog
    style="max-width: 650px; width: 80vw"
  >
    <m-card>
      <v-card-title>
        プロフィール画像を変更
      </v-card-title>
      <v-card-text>
        <v-file-input
          v-model="file"
          accept="image/*"
          :label="'プロフィール画像(' + avatarLimitSizeHumanDisplay + ' Byte)'"
        />
      </v-card-text>
      <v-card-actions class="d-flex flex-row-reverse">
        <m-btn
          @click="submit"
          color="primary"
        >アップロード</m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>
</template>
