<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useServerinfo } from '~/stores/serverinfo';
import type { Serverinfo } from '~/types/serverInfo';

const { getServerinfo } = storeToRefs(useServerinfo());

/**
 * data
 */
//自由に編集できるように
const ServerConfigCloned = ref<Serverinfo>({
  servername: '',
  registration: {
    available: false,
    invite: {
      inviteOnly: false
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
const ServerinfoEdited = ref<boolean>(false);

/**
 * 編集用サーバー情報変数を復元
 */
const restoreServerConfigClone = () => {
  ServerConfigCloned.value = structuredClone(toRaw(getServerinfo.value));
};

/**
 * サーバー設定を適用
 */
const applyServerConfig = () => {

};

onMounted(() => {
  //サーバー設定をクローン
  ServerConfigCloned.value = structuredClone(toRaw(getServerinfo.value));

  //クローンしたサーバー設定の編集を監視
  watch(ServerConfigCloned.value, () => {
    console.log("server(index) :: watch(mounted) : 変更検知");
    //console.log("server(index) :: watch(mounted) : data->", JSON.stringify(ServerinfoCloned.value), JSON.stringify(getServerinfo.value));
    if (JSON.stringify(ServerConfigCloned.value) === JSON.stringify(getServerinfo.value)) {
      ServerinfoEdited.value = false;
    } else {
      ServerinfoEdited.value = true;
    }
  });
});
</script>

<template>
  <div style="height:100%;">
    <NuxtLayout name="server" style="height:100%;">
      <div class="d-flex flex-column" style="height:100%;">

        <p class="text-h5">インスタンス設定</p>
        <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />
        <div class="py-3" style="overflow-y:auto;">

          <span class="mt-5 mb-1 text-h6 d-flex align-center">
            <v-icon class="mr-2">mdi-pound</v-icon>
            <p>チャンネル</p>
          </span>
          <m-card>
            <div>
              <p>
                新規登録者を通知するチャンネル : {{ ServerConfigCloned.config.CHANNEL.channelIdAnnounceRegistration }}
              </p>
            </div>
            <p>
              最初に参加するチャンネル : {{ ServerConfigCloned.config.CHANNEL.defaultJoinOnRegister }}
            </p>
          </m-card>

          <span class="mt-5 mb-1 text-h6 d-flex align-center">
            <v-icon class="mr-2">mdi-message-cog-outline</v-icon>
            <p>メッセージ</p>
          </span>
          <m-card>
            <div>
              <p>
                メッセージの最大文字数 : {{ ServerConfigCloned.config.MESSAGE.TxtMaxLength }}
              </p>
              <v-slider
                v-model="ServerConfigCloned.config.MESSAGE.TxtMaxLength"
                class="mt-3"
                max="5000"
                min="10"
                step="100"
                :ticks="{10:'10', 1000:'1000', 2000:'2k', 3000:'3k', 4000:'4K', 5000:'5k'}"
                show-ticks="always"
              />
            </div>

            <v-divider class="my-8" />

            <div>
              <p>
                ユーザーが添付できるファイルの最大サイズ :
              </p>
              <v-select
                v-model="ServerConfigCloned.config.MESSAGE.FileMaxSize"
                label="添付ファイルサイズ"
                :items="[{'size':5e7, 'display':'50MB'}, {'size':1e8, 'display':'100MB'}, {'size':3e8, 'display':'300MB'}, {'size':5e8, 'display':'500MB'}, {'size':1e9, 'display':'1GB'}]"
                :item-props="(item)=>{
                  return {title: item.display, value:item.size}
                }"
                class="mr-3 mt-3"
              />
            </div>
          </m-card>

          <span class="mt-5 mb-1 text-h6 d-flex align-center">
            <v-icon class="mr-2">mdi-account</v-icon>
            <p>プロフィール</p>
          </span>
          <m-card>
            <div class="my-3">
              <p>
                ユーザー名の最大文字数 : {{ ServerConfigCloned.config.PROFILE.usernameMaxLength }}
              </p>
              <v-slider
                v-model="ServerConfigCloned.config.PROFILE.usernameMaxLength"
                class="mt-3"
                max="32"
                min="2"
                step="1"
                :ticks="{2:'2', 16:'16', 32:'32'}"
                show-ticks="always"
              />
            </div>

            <v-divider class="my-8" />

            <div class="my-3">
              <p>
                アイコン用画像ファイルの最大サイズ :
              </p>
              <v-select
                v-model="ServerConfigCloned.config.PROFILE.iconMaxSize"
                label="画像サイズ"
                :items="[{'size':1e6, 'display':'1MB'}, {'size':5e6, 'display':'5MB'}, {'size':1e7, 'display':'10MB'}, ]"
                :item-props="(item)=>{
                  return {title: item.display, value:item.size}
                }"
                class="mr-3 mt-3"
              />
            </div>
          </m-card>
        </div>
        <div v-if="ServerinfoEdited" class="mt-auto py-2 d-flex justify-end">
          <m-btn @click="restoreServerConfigClone">元に戻す</m-btn>
          <m-btn class="ml-2" color="success">変更を適用</m-btn>
        </div>

      </div>
    </NuxtLayout>
  </div>
</template>
