import { defineStore } from 'pinia';
import { ref } from 'vue';

interface MyUserinfo {
  username: string,
  userid: number,
  sessionid: number,
  role: string,
  channelJoined: []
};

//DEMO
export const demoStore = defineStore('counter', {

  state: () => ({
    count: 3 as number,
  }),

  actions: {
    sumUp() {
      this.count++;
    }
  }

});