<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="pointer-events-none fixed bottom-8 left-1/2 z-[200] -translate-x-1/2 rounded-full bg-ink/90 px-5 py-2.5 text-xs tracking-wide text-paper shadow-lg"
      >
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { message, visible } = useToast()
</script>
