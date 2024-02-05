<script setup lang="ts">

//テーマ切り替え用
const theme = useTheme();

//テーマトグルする
function toggleTheme() {
  theme.global.name.value = theme.global.name.value==="dark"?"light":"dark";
  console.log("theme(settings) :: toggleTheme : theme.name->", theme.global.name.value);
}

</script>

<template>
  <div>
    <p>ここがテーマ</p>
    <v-btn @click="toggleTheme" color="primary">テーマトグルボタン</v-btn>
  </div>

</template>