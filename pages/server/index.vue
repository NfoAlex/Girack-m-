<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useServerinfo } from '~/stores/serverinfo';

const { getServerinfo } = storeToRefs(useServerinfo());
</script>

<template>
  <div>
    <NuxtLayout name="server" style="height:100%;">
      <p class="text-h5">チャンネルブラウザ</p>
      <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />
      <div class="py-3" style="overflow-y:auto; height:100%;">
        <p>チャンネル</p>
        <m-card>
          <p>
            新規登録者を通知するチャンネル : {{ getServerinfo.config.CHANNEL.channelIdAnnounceRegistration }}
          </p>
          <p>
            最初に参加するチャンネル : {{ getServerinfo.config.CHANNEL.defaultJoinOnRegister }}
          </p>
        </m-card>

        <p class="mt-2">メッセージ</p>
        <m-card>
          <p>
            メッセージの最大文字数 : {{ getServerinfo.config.MESSAGE.TxtMaxLength }}
          </p>
          <p>
            ユーザーが添付できるファイルの最大サイズ : {{ getServerinfo.config.MESSAGE.FileMaxSize }}
          </p>
        </m-card>

        <p class="mt-2">プロフィール</p>
        <m-card>
          <p>
            ユーザー名の最大文字数 : {{ getServerinfo.config.PROFILE.usernameMaxLength }}
          </p>
          <p>
            アイコン用画像ファイルの最大サイズ : {{ getServerinfo.config.PROFILE.iconMaxSize }}
          </p>
        </m-card>
      </div>
    </NuxtLayout>
  </div>
</template>
