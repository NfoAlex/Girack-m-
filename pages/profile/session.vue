<script setup lang="ts">
import { useMyUserinfo } from '~/stores/userinfo';
const { getMyUserinfo, getSessionId } = storeToRefs(useMyUserinfo());

definePageMeta(
  {key: route => route.fullPath}
);
</script>

<template>
  <div>
    <NuxtLayout name="profile">
      <div class="pa-4">
      </div>
    </NuxtLayout>
  </div>
</template>