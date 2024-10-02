<script setup lang="ts">
const props = defineProps<{
  fileId: string;
}>();
</script>

<template>
  <div>
    <img
      :src="'/downloadfile/' + props.fileId"
      quality="75"
      class="rounded-lg py-1 px-1"
      style="max-width:64px; max-height:64px;"
      loading="lazy"
    />
  </div>
</template>