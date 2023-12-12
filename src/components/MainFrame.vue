<script lang="ts">

import SidebarView from './SidebarView.vue';

export default {
  components: {SidebarView}
}

</script>

<template>
  <div class="d-flex pa-0">
    <SidebarView />
    <RouterView class="flex-grow-1" />
  </div>
</template>

<style scoped>

</style>