<script setup lang="ts">
import { useServerinfo } from "../stores/serverinfo";
import { useMyUserinfo } from "../stores/userinfo";

const { getServerinfo } = storeToRefs(useServerinfo());
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

const route = useRoute();
</script>

<template>
  <!-- 新規登録ユーザー用 -->
  <Welcome
    v-if="route.query['firstTime']"
    v-model="route.query['firstTime']"
  />

  <div class="header pa-5">
    <h3 class="text-h3">
      {{ getServerinfo.servername }}
    </h3>
    <IndexOnlineUsers />
  </div>
  <div class="pa-5">
    <div
      class="text-h5"
      style="font-weight:600;"
    >ここがホーム</div>
    <p>piniaデータ :</p>
    <m-card>
      <p>Serverinfo :</p>
      <m-card variant="outlined">
        {{ getServerinfo }}
      </m-card>
      <p>MyUserinfo :</p>
      <m-card variant="outlined">
        {{ getMyUserinfo }}
      </m-card>
      <p>セッションID :</p>
      <m-card variant="outlined">
        {{ getSessionId }}
      </m-card>
    </m-card>
  </div>
</template>

<style scoped lang="css">
.header {
  border-radius: 28px 0 0 28px;
  min-height: 300px;
  background-image: url(https://assets-fillet.girak.moe/thumbnail-42ebe2c7-bee2-442e-8b3a-53ac7991b0fa.webp);
  background-size: cover;
}
</style>
