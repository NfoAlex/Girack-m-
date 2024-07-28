<script setup lang="ts">
import { useTheme } from "vuetify";
const theme = useTheme();

function toggleTheme() {
	theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}

onMounted(() => {
	//OSがダークテーマ基準ならそれに合わせる
	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		theme.global.name.value = "dark";
	}
});
</script>

<template>
  <m-btn
    @click="toggleTheme"
    :icon="theme.global.current.value.dark?'mdi-weather-night':'mdi-white-balance-sunny'"
  >
  </m-btn>
</template>