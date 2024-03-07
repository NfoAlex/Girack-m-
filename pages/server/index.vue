<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useServerinfo } from '~/stores/serverinfo';
import type { Serverinfo } from '~/types/serverInfo';

const { getServerinfo } = storeToRefs(useServerinfo());

/**
 * data
 */
//自由に編集できるように
const ServerinfoCloned = ref<Serverinfo>({
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

onMounted(() => {
  //サーバー情報をクローン
  ServerinfoCloned.value = structuredClone(toRaw(getServerinfo.value));

  //クローンしたサーバー情報の編集を監視
  watch(ServerinfoCloned.value, () => {
    console.log("server(index) :: watch(mounted) : 変更検知");
    //console.log("server(index) :: watch(mounted) : data->", JSON.stringify(ServerinfoCloned.value), JSON.stringify(getServerinfo.value));
    if (JSON.stringify(ServerinfoCloned.value) === JSON.stringify(getServerinfo.value)) {
      ServerinfoEdited.value = false;
    } else {
      ServerinfoEdited.value = true;
    }
  });
})
</script>

<template>
  <div>
    <NuxtLayout name="server" style="height:100%;">
      <p class="text-h5">インスタンス設定</p>
      <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />
      <div class="py-3" style="overflow-y:auto; height:100%;">
        <p class="text-h6">チャンネル</p>
        <m-card>
          <p>
            新規登録者を通知するチャンネル : {{ ServerinfoCloned.config.CHANNEL.channelIdAnnounceRegistration }}
          </p>
          <p>
            最初に参加するチャンネル : {{ ServerinfoCloned.config.CHANNEL.defaultJoinOnRegister }}
          </p>
        </m-card>

        <p class="mt-3 text-h6">メッセージ</p>
        <m-card>
          <p>
            メッセージの最大文字数 : {{ ServerinfoCloned.config.MESSAGE.TxtMaxLength }}
          </p>
          <p>
            ユーザーが添付できるファイルの最大サイズ : {{ ServerinfoCloned.config.MESSAGE.FileMaxSize }}
          </p>
        </m-card>

        <p class="mt-3 text-h6">プロフィール</p>
        <m-card>
          <p>
            ユーザー名の最大文字数 : {{ getServerinfo.config.PROFILE.usernameMaxLength }}
          </p>
          <p>
            アイコン用画像ファイルの最大サイズ : {{ ServerinfoCloned.config.PROFILE.iconMaxSize }}
          </p>
        </m-card>
      </div>
    </NuxtLayout>
  </div>
</template>
