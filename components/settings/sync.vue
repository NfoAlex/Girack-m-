<script setup lang="ts">
import { useServerinfo } from "../../stores/serverinfo";
const Serverinfo:any = useServerinfo();
</script>

<template>
  <p>ここで同期</p>
  <m-card>
    <p>カウンタ : {{ Serverinfo.count }}</p>
    <p>Serverinfo : {{ Serverinfo.serverinfo }}</p>
  </m-card>
</template>