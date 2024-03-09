<script setup lang="ts">
const props = defineProps(["roleEditing"]);
</script>

<template>
  <div>
    ここでロール管理
    {{ props.roleEditing }}
  </div>
</template>
