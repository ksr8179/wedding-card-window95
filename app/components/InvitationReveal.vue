<script setup lang="ts">
defineProps<{
  delay?: string
}>()
</script>

<template>
  <div class="animate-fade-up" :style="{ animationDelay: delay ?? '0ms' }">
    <slot />
  </div>
</template>
