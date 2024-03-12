<script setup lang="ts">
import { socket } from '~/socketHandlers/socketInit';
import { useServerinfo } from '~/stores/serverinfo';

import type { Serverinfo } from '~/types/serverInfo';

const { getServerinfo } = storeToRefs(useServerinfo());

/**
 * data
 */
//編集用サーバー情報変数
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

onMounted(() => {
  ServerinfoCloned.value = structuredClone(toRaw(getServerinfo.value));
});
</script>

<template>
  <div>
    <NuxtLayout name="server" style="height:100%;">
      <div class="d-flex flex-column" style="height:100%;">
        <p class="text-h5">基本情報</p>
        <v-divider class="pb-0 mt-3" style="border-radius:8px;" thickness="3" />

        <m-card class="my-3">
          <v-text-field label="インスタンス名" variant="outlined" />
        </m-card>
      </div>
    </NuxtLayout>
  </div>
</template>
