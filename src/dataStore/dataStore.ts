import { defineStore } from 'pinia';
import { ref } from 'vue';

//DEMO
export const demoStore = defineStore('counter', {

  state: () => ({
    count: 3 as number,
  }),

  getters: {
    increment: (state) => {
      state.count++;
      console.log("dataStore :: increment : インクリした");
      return state.count;
    }
  }

});