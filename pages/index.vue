<script setup lang="ts">
import { useServerinfo } from "../stores/serverinfo";
const Serverinfo:any = useServerinfo();
</script>

<template>
  <div class="pa-5">
    <div class="">HelloWorld</div>
    <m-card>
      <p>カウンタ : {{ Serverinfo.count }}</p>
      <p>Serverinfo : {{ Serverinfo.serverinfo }}</p>
    </m-card>
  </div>
</template>
