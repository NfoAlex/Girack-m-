<script setup lang="ts">
import { useMyUserinfo } from "../stores/userinfo";
const { getMyUserinfo } = storeToRefs(useMyUserinfo());
</script>

<template>
  <div class="pa-4">
    <p>
      ここがプロフィール
    </p>
  </div>
</template>