<script lang="ts">

import SidebarView from './SidebarView.vue';

export default {
  components: {SidebarView}
}

</script>

<template>
  <div class="d-flex pa-0">
    <SidebarView class="SIDE" />
    <RouterView class="flex-grow-1" />
  </div>
</template>

<style>

html {
  background-color: #eee;
}

</style>