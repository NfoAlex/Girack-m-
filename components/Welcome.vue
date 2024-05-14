<script setup lang="ts">

const page = ref<number>(1);

const router = useRouter();
</script>

<template>
  <v-dialog width="55vw" max-width="550px" height="65vh" max-height="750px">
    <m-card v-if="page===1" height="100%" width="100%" class="pa-7">
      <v-card-body class="pt-5">
        <h2 class="mb-3 text-center">Girackへようこそ!</h2>
        <li>しゃべろう！</li>
      </v-card-body>
      <v-card-actions class="mt-auto d-flex flex-row-reverse">
        <m-btn @click="page=2" variant="tonal">次へ</m-btn>
      </v-card-actions>
    </m-card>
    <m-card v-if="page===2" height="100%" width="100%" class="pa-7">
      <v-card-body class="pt-5">
        <p class="text-center">早速チャンネルを探そう!</p>
      </v-card-body>
      <v-card-actions class="mt-auto d-flex flex-row-reverse">
        <m-btn @click="router.push('/browser')" color="primary">行く！</m-btn>
      </v-card-actions>
    </m-card>
  </v-dialog>
</template>
