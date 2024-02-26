<script setup lang="ts">
import { useConfig } from '~/stores/config';

const { getConfig } = storeToRefs(useConfig());

/**
 * data
 */
const themeSwitchDark = ref<boolean>(true);

//テーマ切り替え用
const theme = useTheme();

//テーマトグルする
const toggleTheme = () => {
  theme.global.name.value =
    theme.global.name.value === "dark" ? "light" : "dark";
  console.log(
    "theme(settings) :: toggleTheme : theme.name->",
    theme.global.name.value
  );
};

//テーマ設定に応じてスイッチの値設定
onMounted(() => {
  if (getConfig.value.theme === "dark") themeSwitchDark.value = true;
});
</script>

<template>
  <div>
    <NuxtLayout name="settings">
      <p class="text-h6 mb-6">テーマ</p>
      <div class="d-flex justify-center mx-auto">
        <v-switch
          @click="toggleTheme"
          v-model="themeSwitchDark"
          prepend-icon="mdi:mdi-weather-sunny"
          append-icon="mdi:mdi-weather-night"
        />
      </div>
    </NuxtLayout>
  </div>
</template>
