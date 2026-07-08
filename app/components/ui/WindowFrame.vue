<template>
  <div class="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
    
    <div class="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-0.5 flex justify-between items-center mb-2">
      <span class="text-[11px] font-bold tracking-wide">{{ title }}</span>
    </div>
    
    <div class="bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-b-[#808080] border-r-[#808080] p-2 overflow-y-auto">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps(
  { 
    title: String
  });
</script>