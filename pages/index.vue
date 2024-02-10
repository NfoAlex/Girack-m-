<script setup lang="ts">
import { useServerinfo } from "../stores/serverinfo";
import { useMyUserinfo } from "../stores/userinfo";
const Serverinfo:any = useServerinfo();
//const MyUserinfo:any = useMyUserinfo();
const { getMyUserinfo } = storeToRefs(useMyUserinfo());
</script>

<template>
  <div class="pa-5">
    <div class="text-h4 my-3">ここがホーム</div>
    <p>piniaデータ : </p>
    <m-card>
      <p>カウンタ : {{ Serverinfo.count }}</p>
      <p>Serverinfo : </p>
      <m-card variant="outlined">
        {{ Serverinfo.serverinfo }}
      </m-card>
      <p>MyUserinfo : </p>
      <m-card variant="outlined">
        {{ getMyUserinfo }}
      </m-card>
    </m-card>
  </div>
</template>
