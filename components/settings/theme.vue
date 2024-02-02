<script setup lang="ts">

const theme = useTheme();
onMounted(() => {
  console.log("theme(settings) :: onMounted : theme->", theme);
});

function toggleTheme() {
  theme.global.name.value = theme.global.name.value==="dark"?"light":"dark";
  console.log("theme(settings) :: toggleTheme : theme.name->", theme.global.name.value);
}

</script>

<template>
  ここがテーマ
  <v-btn @click="toggleTheme">テーマトグル</v-btn>

</template>