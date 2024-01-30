<script lang="ts">
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();

    return { route };
  }
}

</script>

<template>あなたは今 {{ route.params.id }} にいます</template>
