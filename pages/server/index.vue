<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import getMyRolePower from "~/composables/getMyRolePower";
import { useMyUserinfo } from '~/stores/userinfo';
const router = useRouter();

import type { Serverinfo } from '~/types/serverInfo';

const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

/**
 * data
 */
//情報が編集されたかどうか
const stateEdited = ref<boolean>(false);
//サーバー情報
const ServerinfoFull = ref<Serverinfo>({
  servername: '',
  registration: {
    available: false,
    invite: {
      inviteOnly: false,
      inviteCode: ''
    }
  },
  config: {
    PROFILE: {
      iconMaxSize: 0,
      usernameMaxLength: 0
    },
    CHANNEL: {
      channelIdAnnounceRegistration: '',
      defaultJoinOnRegister: []
    },
    MESSAGE: {
      TxtMaxLength: 0,
      FileMaxSize: 0
    }
  }
});
//編集用サーバー情報変数
const ServerinfoCloned = ref<Serverinfo>({
  servername: '',
  registration: {
    available: false,
    invite: {
      inviteOnly: false,
      inviteCode: ''
    }
  },
  config: {
    PROFILE: {
      iconMaxSize: 0,
      usernameMaxLength: 0
    },
    CHANNEL: {
      channelIdAnnounceRegistration: '',
      defaultJoinOnRegister: []
    },
    MESSAGE: {
      TxtMaxLength: 0,
      FileMaxSize: 0
    }
  }
});

/**
 * 編集用JSON変数を復元(クローンし直し)
 */
const restoreServerinfoCloned = () => {
  //編集用JSON変数へクローン
  ServerinfoCloned.value = structuredClone(toRaw(ServerinfoFull.value));
  //編集状態を初期化
  stateEdited.value = false;

  //編集用JSONの変更を監視する
  watch(ServerinfoCloned.value, () => {
    if (JSON.stringify(ServerinfoCloned.value) === JSON.stringify(ServerinfoFull.value)) {
      stateEdited.value = false;
    } else {
      stateEdited.value = true;
    }
  });
}

/**
 * サーバー情報を更新させる
 */
const updateServerinfo = () => {
  socket.emit("updateServerInfo", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    },
    servername: ServerinfoCloned.value.servername,
    registration: ServerinfoCloned.value.registration
  });
}

/**
 * サーバー情報取得
 * @param dat
 */
const SOCKETfetchServerInfoFull = (dat:{result:string, data:Serverinfo}) => {
  console.log("/server :: SOCKETfetchServerInfoFull : dat->", dat);

  //結果が成功以外なら停止
  if (dat.result !== "SUCCESS") return;
  
  //サーバー情報を格納
  ServerinfoFull.value = dat.data;

  //編集用JSON変数へクローン
  ServerinfoCloned.value = structuredClone(toRaw(dat.data));
  //編集状態を初期化
  stateEdited.value = false;

  //編集用JSONの変更を監視する
  watch(ServerinfoCloned.value, () => {
    if (JSON.stringify(ServerinfoCloned.value) === JSON.stringify(ServerinfoFull.value)) {
      stateEdited.value = false;
    } else {
      stateEdited.value = true;
    }
  });
}

onBeforeMount(() => {
  //サーバー管理の権限を持っていないならロール管理ページへ
  if (!getMyRolePower().ServerManage) router.push("/server/role");
});

onMounted(() => {
  //サーバーFull情報受け取り用
  socket.on("RESULT::fetchServerInfoFull", SOCKETfetchServerInfoFull);

  //サーバー情報を全取得
  socket.emit("fetchServerInfoFull", {
    RequestSender: {
      userId: getMyUserinfo.value.userId,
      sessionId: getSessionId.value
    }
  });
});

onUnmounted(() => {
  socket.off("RESULT::fetchServerInfoFull", SOCKETfetchServerInfoFull);
});
</script>

<template>
  <div style="height:100%;">
    <NuxtLayout name="server" style="height:100%;">
      <div class="d-flex flex-column" style="height:100%;">
        <p class="text-h5">基本情報</p>
        <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />

        <div style="overflow-y:auto;">
          <m-card class="my-3">
            <p class="mb-2 text-h6">
              {{ 
                ServerinfoCloned.servername!==ServerinfoFull.servername
                ?
                  '*インスタンス名'
                  :
                  'インスタンス名'
              }}
            </p>
            <v-text-field
              v-model="ServerinfoCloned.servername"
              variant="outlined"
              hide-details
            />
          </m-card>

          <m-card class="my-3">
            <p class="mb-2 text-h6">新規登録</p>

            <v-switch
              v-model="ServerinfoCloned.registration.available"
              label="新規登録を有効化"
            />

            <v-divider class="my-5" />

            <v-switch
              v-model="ServerinfoCloned.registration.invite.inviteOnly"
              :disabled="!ServerinfoCloned.registration.available"
              label="新規登録を招待制にする"
              class="my-3"
            />

            <v-text-field
              v-model="ServerinfoCloned.registration.invite.inviteCode"
              :disabled="
                !ServerinfoCloned.registration.invite.inviteOnly
                ||
                !ServerinfoCloned.registration.available
              "
              :label="
                ServerinfoCloned.registration.invite.inviteCode!==ServerinfoFull.registration.invite.inviteCode
                ?
                  '*招待コード'
                  :
                  '招待コード'
              "
              variant="outlined"
              hide-details
            />
          </m-card>

          <m-card
            v-if="stateEdited"
            position="sticky"
            class="mx-auto"
            style="position:sticky; bottom:0px; width:fit-content;"
          >
            <m-btn
              @click="updateServerinfo"
              color="primary"
            >
              変更を適用
            </m-btn>
            <m-btn
              @click="restoreServerinfoCloned"
              variant="text"
            >
              復元
            </m-btn>
          </m-card>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
