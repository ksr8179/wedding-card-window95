<template>
  <div class="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
    <div class="bg-[#000080] text-white px-2 py-0.5 flex justify-between items-center mb-1">
      <span class="text-[10px] font-bold tracking-wider">{{ title }}</span>
    </div>
    <div class="bg-[#e0e0e0] p-2 border border-white border-b-[#808080] border-r-[#808080]">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ title: String });
</script>