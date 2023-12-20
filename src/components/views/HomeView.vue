<script setup lang="ts">
import { demoStore } from '@data/dataStore';

// ストアを使用
const demo = demoStore();
</script>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: "HomeView", 

    data() {
      return {
        text: "asdf"
      }
    },
  });

</script>

<template>
  <div class="pa-5 MAIN">
    <p>ここがホーム : {{ text }} :: {{  demo.count }}</p>
    <v-btn
      @click="demo.sumUp"
    >
      インクリ
    </v-btn>
  </div>
</template>

<style scoped>

.MAIN {
  border-top-left-radius: 28px;
  border-bottom-left-radius: 28px;
  background-color: #fff;
}

</style>