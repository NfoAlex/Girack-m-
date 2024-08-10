<script setup lang="ts">
//プロフィールページへ移動させるだけ

const router = useRouter();

onMounted(() => {
  router.push("/profile/me"); //プロフィールページへ
});
</script>

<template>
  <div class="text-center">
    <p>ロード中...</p>
  </div>
</template>