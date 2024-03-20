<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';

const { getMyUserinfo } = storeToRefs(useMyUserinfo());

/**
 * data
 */
const file = ref<any>();
const metadata = ref<{userId:string}>({
  userId: getMyUserinfo.value.userId
});

//プロフィール画像をあっぷ
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
          label="プロフィール画像"
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
