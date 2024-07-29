<script setup lang="ts">
//同期ページへ移動させるだけ

const router = useRouter();

onMounted(() => {
  router.push("/settings/sync"); //同期ページへ移動
});
</script>

<template>
  <div>
    ロード中...
  </div>
</template>