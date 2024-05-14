<script setup lang="ts">

const page = ref<number>(1);
</script>

<template>
  <v-dialog width="55vw" max-width="550px" height="65vh" max-height="750px">
    <m-card height="100%" width="100%" class="pa-7">
      <v-card-body class="pt-5">
        <h2 class="mb-3 text-center">Girackへようこそ!</h2>
        <li>しゃべろう！</li>
      </v-card-body>
      <v-card-actions class="mt-auto d-flex flex-row-reverse">
        <m-btn color="primary">次へ</m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>
</template>
