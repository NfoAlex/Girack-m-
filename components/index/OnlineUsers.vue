<script setup lang="ts">
import { useUserIndex } from "~/stores/userindex";
const { getUserinfo, getOnlineUsers } = storeToRefs(useUserIndex());
</script>

<template>
  <div class="mt-6">
    <h4>オンラインユーザー</h4>
    <v-chip
      v-for="userId of getOnlineUsers"
      class="mr-1"
      size="large"
      variant="flat"
    >
      <v-avatar class="mr-2" size="24">
        <v-img :src="'/icon/' + userId" alt="John"></v-img>
      </v-avatar>
      <p>{{ getUserinfo(userId).userName }}</p>
    </v-chip>
  </div>
</template>
