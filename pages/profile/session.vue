<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

definePageMeta(
  {key: route => route.fullPath}
);

//セッション情報のInterface
export interface IUserSession {
  userId: string,
  sessionId: string,
  sessionName: string,
  loggedinTime: Date,
  loggedinTimeFirst: Date
};

/**
 * data
 */
const sessionData = ref<IUserSession[]>([]);
const fullFetched = ref<boolean>(false);
const currentIndexNum = ref<number>(1);

/**
 * セッション情報を取得する
 */
const fetchSession = () => {
  socket.emit("fetchSession", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    indexNum: currentIndexNum.value
  });
}

/**
 * セッション情報受け取り
 * @param dat 
 */
const SOCKETfetchSession = (dat:{result:string, data:IUserSession[]|null}) => {
  console.log("session :: SOCKETfetchSession : dat->", dat);
  //結果成功で、データがnullじゃないなら格納
  if (dat.result === "SUCCESS" && dat.data !== null) {
    sessionData.value = [...sessionData.value, ...dat.data];

    //データの数に応じて状況用変数を設定
    if (dat.data.length >= 1) {
      //インデックスの位置を加算
      currentIndexNum.value++;
    } else {
      //すべて取り切ったと設定
      fullFetched.value = true;
    }
  }
}

onMounted(() => {
  socket.on("RESULT::fetchSession", SOCKETfetchSession);

  //セッション情報を取得
  fetchSession();
});

onUnmounted(() => {
  socket.off("RESULT::fetchSession", SOCKETfetchSession);
});
</script>

<template>
  <div>
    <NuxtLayout name="profile">
      <div class="pa-4 d-flex flex-column align-center">
        <m-card v-for="session in sessionData" class="mb-2">
          {{ session }}

          <p>{{ session.sessionName }}</p>
          <v-divider :thickness="3" class="my-2" />
          <div class="d-flex">
            <m-btn>
              <v-icon size="small">mdi-pencil</v-icon>
              セッション名を変更
            </m-btn>
            <m-btn variant="tonal" class="ml-auto" color="error">ログアウト</m-btn>
          </div>
        </m-card>

        <m-btn @click="fetchSession" v-if="!fullFetched" class="mx-auto mt-2">
          さらに読み込む
        </m-btn>
      </div>
    </NuxtLayout>
  </div>
</template>