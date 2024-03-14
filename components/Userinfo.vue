<script setup lang="ts">
const props = defineProps<{
  userId: string
}>();

</script>

<template>
  <v-dialog>
    <m-card>
      {{ props.userId }}
    </m-card>
  </v-dialog>
</template>
