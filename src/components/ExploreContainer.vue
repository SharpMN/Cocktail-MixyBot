<template>
  <div class="container"><slot></slot></div>
</template>

<script setup lang="ts">
defineProps({
  name: String,
});
</script>
