<script lang="ts">
  import { demoStore } from '../../dataStore/dataStore';
  import { defineComponent, computed } from 'vue';

  export default defineComponent({
    name: "HomeView", 

    setup() {
      const demo = demoStore();

      return {
        count: computed(() => demo.count),
        sum: demo.sumUp
      };
    },

    data() {
      return {
        text: "asdf"
      }
    },
  });

</script>

<template>
  <div class="pa-5">
    <p>ここがホーム : {{ text }} :: {{  count }}</p>
    <v-btn
      @click="sum"
    >
      インクリ
    </v-btn>
  </div>
</template>