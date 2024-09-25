<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    imageUrls: string[];
    indexSelected: number;
  }>(),
  {
    indexSelected: 0,
  },
);

const emits = defineEmits<(e: "closeDialog") => void>();

/**
 * data
 */
const activeImageUrl = ref<string>(props.imageUrls[0]);

onMounted(() => {
  //console.log("ImageViewer :: マウントされた");

  //表示画像をマウント時の指定インデックスへ変更
  activeImageUrl.value = props.imageUrls[props.indexSelected];
});
</script>

<template>
  <v-dialog height="85vh" class="d-flex flex-column align-center justify-center">
    <div
      @click="emits('closeDialog')"
      class="flex-grow-1 flex-shrink-1 pa-1 d-flex align-center justify-center"
    >
      <img
        @click.stop="console.log('pic')"
        :src="activeImageUrl"
        style="width:auto; height:auto; max-height:70vh; max-width:95vw;"
      />
    </div>

    <m-card
      v-if="props.imageUrls.length!==1"
      class="flex-shrink-0 mt-auto mx-auto d-flex flex-row align-center overflow-x-auto"
      maxWidth="650"
      width="100%"
    >
      <div
        v-for="imageUrl of props.imageUrls"
        style="max-width:100px; max-height:75px; height:fit-content;"
        :class="imageUrl===activeImageUrl?'imageSelected':'imageNotSelected'"
        class="mr-1 rounded-lg d-flex justify-center align-center"
      >
        <NuxtImg
          @click="activeImageUrl=imageUrl"
          :src="imageUrl"
          :modifiers="{ roundCorner: '12', fit: 'contain', format: 'jpg', quality: 70 }"
          height="100%"
          class="rounded-lg"
          style="max-height:70px; max-width:95px; width:auto"
          loading="lazy"
          quality="50"
        />
      </div>
    </m-card>
  </v-dialog>
</template>

<style scoped>
.imageSelected {
  border: 2.5px solid rgb(var(--v-theme-primary));
}

.imageNotSelected {
  border: 2.5px solid rgba(0,0,0,0);
}
</style>