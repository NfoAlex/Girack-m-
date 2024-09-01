<script setup lang="ts">
import ApiManage from "~/components/profile/api/ApiManage.vue";

/**
 * data
 */
const page = ref<"MANAGE" | "TEST">("MANAGE");
</script>

<template>
  <NuxtLayout name="profile">
    <div class="pa-4 d-flex flex-column" style="height:100%;">
      <span class="d-flex flex-wrap">
        <m-btn
          @click="page='MANAGE'"
          :color="page==='MANAGE'?'primary':null"
        >管理</m-btn>
        <m-btn
          @click="page='TEST'"
          :color="page==='TEST'?'primary':null"
        >テスト</m-btn>
      </span>

      <div class="flex-grow-1">
        <ApiManage
          v-if="page==='MANAGE'"
        />
      </div>
    </div>
  </NuxtLayout>
</template>