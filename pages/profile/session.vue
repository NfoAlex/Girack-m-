<script setup lang="ts">
import { socket } from "~/socketHandlers/socketInit";
import { useMyUserinfo } from "~/stores/userinfo";
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

definePageMeta({ key: (route) => route.fullPath });

//セッション情報のInterface
export interface IUserSession {
  userId: string;
  sessionId: string;
  sessionName: string;
  loggedinTime: Date;
  loggedinTimeFirst: Date;
}

/**
 * data
 */
const sessionArray = ref<IUserSession[]>([]);
const currentActiveSession = ref<IUserSession | null>();
const fullFetched = ref<boolean>(false);
const currentIndexNum = ref<number>(1);

const displayChangingName = ref<boolean>(false);
const sessionChangingName = ref<IUserSession | null>();
const newNameChanging = ref<string>("");

/**
 * セッション情報を取得する
 */
const fetchSession = () => {
  socket.emit("fetchSession", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    indexNum: currentIndexNum.value,
  });
};

/**
 * セッション名を変更
 * @param arrIndex
 */
const changeSessionName = () => {
  //値がないなら停止
  if (!currentActiveSession.value) return;
  if (!sessionChangingName.value) return;

  socket.emit("changeSessionName", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    targetSessionId: sessionChangingName.value.sessionId,
    newName: newNameChanging.value,
  });

  //ダイアログを非表示に
  displayChangingName.value = false;

  //現在のセッションとセッションIdが一緒なら名前更新を適用して終了
  if (
    currentActiveSession.value.sessionId === sessionChangingName.value.sessionId
  ) {
    currentActiveSession.value.sessionName = newNameChanging.value;
    return;
  }

  //セッション配列から探して名前更新を適用
  for (const index in sessionArray.value) {
    if (
      sessionArray.value[index].sessionId ===
      sessionChangingName.value.sessionId
    ) {
      sessionArray.value[index].sessionName = newNameChanging.value;
      return;
    }
  }
};

/**
 * ログアウトさせる
 */
const logoutSession = (arrIndex: number) => {
  socket.emit("sessionLogout", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value,
    },
    targetSessionId: sessionArray.value[arrIndex].sessionId,
  });

  //指定のセッション情報を表示から削除
  sessionArray.value.splice(arrIndex, 1);
};

/**
 * セッション情報受け取り
 * @param dat
 */
const SOCKETfetchSession = (dat: {
  result: string;
  data: {
    sessionData: IUserSession[],
    activeSession: IUserSession
  };
}) => {
  console.log("session :: SOCKETfetchSession : dat->", dat);
  //結果成功で、データがnullじゃないなら格納
  if (dat.result === "SUCCESS" && dat.data !== null) {
    //現在使っているセッションを抜き出して格納
    const sessionWithOutActiveOne = dat.data.sessionData.filter((_session) => {
      if (_session.sessionId !== getSessionId.value) {
        return true;
      }

      return false;
    });

    //今のアクティブセッションを格納
    currentActiveSession.value = dat.data.activeSession;

    //セッション配列へ格納
    sessionArray.value = [...sessionArray.value, ...sessionWithOutActiveOne];

    //データの数に応じて状況用変数を設定
    if (dat.data.sessionData.length >= 1) {
      //インデックスの位置を加算
      currentIndexNum.value++;
    } else {
      //すべて取り切ったと設定
      fullFetched.value = true;
    }
  }
};

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

  <v-dialog v-model="displayChangingName" width="75vw" max-width="650px">
    <m-card>
      <v-card-title>セッション名の変更</v-card-title>
      <v-card-text>
        <m-card variant="outlined" style="border: 2px gray solid" class="mb-4 d-flex align-center">
          <span class="mr-2">現在のセッション名 : </span>
          <p class="text-truncate" style="color:rgb(var(--v-theme-primary))">{{ sessionChangingName?.sessionName }}</p>
        </m-card>
        <v-text-field
          v-model="newNameChanging"
          label="変更後の名前"
        />
      </v-card-text>
      <v-card-actions>
        <m-btn @click="changeSessionName" color="primary">
          名前を変更
        </m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>

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
            <m-btn
              @click="sessionChangingName=currentActiveSession; displayChangingName=true;"
              size="small"
              variant="text"
            >
              <v-icon size="small">mdi-pencil</v-icon>
              セッション名を変更
            </m-btn>
          </div>
        </m-card>

        <v-divider class="my-6" width="100%"></v-divider>

        <m-card v-for="session,index in sessionArray" class="mb-2" style="width:100%">
          <span class="d-flex">
            <p class="text-truncate">{{ session.sessionName }}</p>
            <v-chip class="ml-auto flex-shrink-0 align-center" size="small">
              最終ログイン : {{ new Date(session.loggedinTime).toLocaleDateString() }}
            </v-chip>
          </span>
          <v-divider :thickness="3" class="my-2" />
          <div class="d-flex">
            <m-btn
              @click="sessionChangingName=session; displayChangingName=true;"
              size="small"
              variant="text"
            >
              <v-icon size="small">mdi-pencil</v-icon>
              セッション名を変更
            </m-btn>
            <v-tooltip text="ダブルクリックでログアウト">
              <template v-slot:activator="{ props }">
                <m-btn
                  @dblclick="logoutSession(index)"
                  v-bind="props"
                  size="small"
                  variant="text"
                  class="ml-auto"
                  color="error"
                >ログアウト</m-btn>
              </template>
            </v-tooltip>
          </div>
        </m-card>

        <m-btn @click="fetchSession" v-if="!fullFetched" class="mx-auto mt-2">
          さらに読み込む
        </m-btn>
      </div>
    </NuxtLayout>
  </div>
</template>