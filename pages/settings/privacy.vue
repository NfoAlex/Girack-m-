<script setup lang="ts">
/**
 * data
 */
const justTrue = ref<boolean>(true);
</script>

<template>
  <div>
    <NuxtLayout name="settings">
      <p class="text-h6 mb-6">プライバシー</p>
      <m-card>
        <v-switch
          v-model="justTrue"
          readonly
          label="自分の発言を機械学習に使うことを許可する"
        />
      </m-card>
    </NuxtLayout>
  </div>
</template>
