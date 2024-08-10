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
const sessionArray = ref<IUserSession[]>([]);
const currentActiveSession = ref<IUserSession|null>();
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
    //現在使っているセッションを抜き出して格納
    const sessionWithOutActiveOne = dat.data.filter((_session) => {
      if (_session.sessionId !== getSessionId.value) {
        return true;
      }

      //使っているセッションを格納
      currentActiveSession.value = _session;
      return false;
    });

    sessionArray.value = [...sessionArray.value, ...sessionWithOutActiveOne];

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
        <m-card v-if="currentActiveSession" style="width:100%">
          <span class="d-flex">
            <p>{{ currentActiveSession.sessionName }}</p>
            <v-chip size="small" color="success" class="ml-auto">現在のセッション</v-chip>
          </span>
          <v-divider :thickness="3" class="my-2" />
          <div class="d-flex">
            <m-btn size="small" variant="text">
              <v-icon size="small">mdi-pencil</v-icon>
              セッション名を変更
            </m-btn>
          </div>
        </m-card>

        <v-divider class="my-6" width="100%"></v-divider>

        <m-card v-for="session in sessionArray" class="mb-2" style="width:100%">
          <span class="d-flex">
            <p class="text-truncate">{{ session.sessionName }}</p>
            <v-chip class="ml-auto flex-shrink-0 align-center" size="small">
              最終ログイン : {{ new Date(session.loggedinTime).toLocaleDateString() }}
            </v-chip>
          </span>
          <v-divider :thickness="3" class="my-2" />
          <div class="d-flex">
            <m-btn size="small" variant="text">
              <v-icon size="small">mdi-pencil</v-icon>
              セッション名を変更
            </m-btn>
            <m-btn
              size="small"
              variant="text"
              class="ml-auto"
              color="error"
            >ログアウト</m-btn>
          </div>
        </m-card>

        <m-btn @click="fetchSession" v-if="!fullFetched" class="mx-auto mt-2">
          さらに読み込む
        </m-btn>
      </div>
    </NuxtLayout>
  </div>
</template>