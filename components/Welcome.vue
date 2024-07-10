<script setup lang="ts">
const router = useRouter();//ページ移動用

/**
 * data
 */
const page = ref<number>(1); //画面のページ
const statusNotificationAllowed = ref<string>("");

//最初に通知が許可されているか事前に取得
statusNotificationAllowed.value = Notification.permission;

/**
 * 通知の許可を要請
 */
const askNotificationPermission = () => {
  Notification.requestPermission().then((permission) => {
    statusNotificationAllowed.value = permission;
  });
}

/**
 * 通知テストするだけ
 */
const testNotification = () => {
  const notification = new Notification("通知テスト", {
    body: "これはGirack-m-による通知テストです。"
  });
}
</script>

<template>
  <v-dialog width="55vw" max-width="550px" height="65vh" max-height="750px">

    <m-card v-if="page===1" height="100%" width="100%" class="pa-7">
      <v-card-body class="pt-5">
        <h2 class="mb-3 text-center">Girackへようこそ!</h2>
        <v-divider class="my-2" />
        <li>しゃべろう！</li>
      </v-card-body>
      <v-card-actions class="mt-auto">
        <m-btn @click="page=2" variant="tonal">次へ</m-btn>
      </v-card-actions>
    </m-card>

    <m-card v-if="page===2" height="100%" width="100%" class="pa-7">
      <v-card-body class="pt-5">
        <h2 class="mb-3 text-center">通知を許可しよう!</h2>
        <v-divider class="my-2" />
        <p>下のボタンをクリックして通知を許可してください。</p>

        <m-btn block class="mt-10 mb-3" @click="askNotificationPermission">
          通知を許可する
        </m-btn>
        <m-btn block class="mb-6" @click="testNotification">
          通知テストしてみる
        </m-btn>

        <m-card variant="outlined" class="text-center">
          <p class="my-3 text-h5">通知の許可状態 : {{ statusNotificationAllowed==='granted'?'許可!👍':'許可されていません...😑' }}</p>
        </m-card>
      </v-card-body>
      <v-card-actions class="mt-auto">
        <m-btn @click="page=2" variant="tonal">次へ</m-btn>
      </v-card-actions>
    </m-card>

    <m-card v-if="page===3" height="100%" width="100%" class="pa-7">
      <v-card-body class="pt-5">
        <p class="text-center">早速チャンネルを探そう!</p>
        <v-divider class="my-2" />
      </v-card-body>
      <v-card-actions class="mt-auto">
        <m-btn @click="router.push('/browser')" color="primary">行く！</m-btn>
      </v-card-actions>
    </m-card>

  </v-dialog>
</template>
