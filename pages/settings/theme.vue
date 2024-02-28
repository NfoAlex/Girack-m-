<script setup lang="ts">
import { useConfig } from '~/stores/config';

const { getConfig } = storeToRefs(useConfig());

/**
 * data
 */
const themeSwitchDark = ref<boolean>(false);

//テーマ切り替え用
const theme = useTheme();

//テーマスイッチの変更を監視
watch(themeSwitchDark, () => {
  //設定Storeに値をセット
  getConfig.value.theme = themeSwitchDark.value ? "dark" : "light";
  //テーマを切り替え
  theme.global.name.value = getConfig.value.theme;

  /*
  console.log(
    "theme(settings) :: toggleTheme : theme.name->",
    theme.global.name.value,
    getConfig.value.theme,
    themeSwitchDark.value
  );
  */
});

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
          v-model="themeSwitchDark"
          prepend-icon="mdi:mdi-weather-sunny"
          append-icon="mdi:mdi-weather-night"
        />
      </div>
    </NuxtLayout>
  </div>
</template>
