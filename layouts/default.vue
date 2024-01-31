<template>
  <div>
    <span class="ma-3 d-flex">
      <NuxtLink to="/"><v-btn color="primary" class="mx-1">トップ</v-btn></NuxtLink>
      <NuxtLink to="/channel"><v-btn color="secondary" class="mx-1">チャンネルへ行ってみる</v-btn></NuxtLink>
      <NuxtLink to="/channel/1234"><v-btn color="secondary" class="mx-1">適当なチャンネル</v-btn></NuxtLink>
    </span>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
