<script setup lang="ts">
const props = defineProps<{
  imageUrls: string[]
}>();

const emits = defineEmits<(e: "closeDialog") => void>();

/**
 * data
 */
const activeImageUrl = ref<string>(props.imageUrls[0]);

onMounted(() => {
  console.log("ImageViewer :: マウントされた");
});
</script>

<template>
  <v-dialog height="85vh" class="d-flex flex-column align-center justify-center">
    <div
      @click="emits('closeDialog')"
      class="flex-grow-1 d-flex align-center justify-center"
    >
      <v-img
        @click.stop="null"
        :src="activeImageUrl"
        maxHeight="70vh"
      />
    </div>

    <m-card v-if="props.imageUrls.length!==1" class="mt-auto mx-auto" maxWidth="650" width="100%">
      asdf
    </m-card>
  </v-dialog>
</template>