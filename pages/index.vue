<script setup lang="ts">
import { useServerinfo } from "../stores/serverinfo";
import { useMyUserinfo } from "../stores/userinfo";

const { getServerinfo, getCount } = storeToRefs(useServerinfo());
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());
</script>

<template>
  <div class="header pa-5">
    <h3 class="text-h3">
      {{ getServerinfo.servername }}
    </h3>
    <div class="mt-12">
      <h4>オンラインユーザー</h4>
      <v-chip size="large" variant="flat">
        <v-avatar class="mr-2" size="x-small">
          <v-img
            src="https://cdn.vuetifyjs.com/images/john.jpg"
            alt="John"
          ></v-img>
        </v-avatar>
        {{ getMyUserinfo.userName }}
      </v-chip>
    </div>
  </div>
  <div class="pa-5">
    <div class="text-h4 my-3">ここがホーム</div>
    <p>piniaデータ :</p>
    <m-card>
      <p>カウンタ : {{ getCount }}</p>
      <p>Serverinfo :</p>
      <m-card variant="outlined">
        {{ getServerinfo }}
      </m-card>
      <p>MyUserinfo :</p>
      <m-card variant="outlined">
        {{ getMyUserinfo }}
      </m-card>
      <p>セッションID : </p>
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
