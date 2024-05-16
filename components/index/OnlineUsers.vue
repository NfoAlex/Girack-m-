<script setup lang="ts">
import { useUserIndex } from "~/stores/userindex";
const { getUserinfo, getOnlineUsers } = storeToRefs(useUserIndex());
</script>

<template>
    <div class="mt-12">
      <h4>オンラインユーザー</h4>
      <v-chip v-for="userId of getOnlineUsers" size="large" variant="flat">
        <v-avatar class="mr-2" size="x-small">
          <v-img
            :src="'/icon/' + userId"
            alt="John"
          ></v-img>
        </v-avatar>
        <p>{{ getUserinfo(userId).userName }}</p>
      </v-chip>
    </div>
</template>
