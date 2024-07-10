<script setup lang="ts">
import { useConfig } from '~/stores/config';

const { getConfig } = storeToRefs(useConfig());

/**
 * data
 */
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
  <div>
    <NuxtLayout name="settings">
      <p class="text-h6 mb-6">通知</p>
      <m-card>

        <m-card-compact variant="outlined" class="text-center mb-3">
          <p class="my-6">
            通知の許可状態 : {{ statusNotificationAllowed==='granted'?'許可!👍':'許可されていません...😑' }}
            <span class="text-disabled"> ( {{ statusNotificationAllowed }} ) </span>
          </p>
        </m-card-compact>

        <span class="d-flex flex-wrap">
          <m-btn @click="askNotificationPermission">
            <v-icon color="primary">mdi-bell</v-icon>
            通知許可を取得する
          </m-btn>
          <m-btn @click="testNotification">
            <v-icon color="secondary">mdi-test-tube</v-icon>
            通知をテストする
          </m-btn>
        </span>

        <v-divider class="my-4" />

        <v-switch
          v-model="getConfig.notification.notifyAllMessages"
          label="受信するすべてのメッセージを通知する"
        />

        <v-switch
          v-model="getConfig.notification.notifyMention"
          label="受信した自分宛てのメンションメッセージを通知する"
        />

      </m-card>
    </NuxtLayout>
  </div>
</template>
