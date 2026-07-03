<template>
  <section class="flex items-center justify-center min-h-screen bg-[#008080] p-4 font-['MS_Sans_Serif',Arial,sans-serif]">
    <div class="w-full max-w-sm bg-[#c0c0c0] border-2 border-white border-b-black border-r-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
      
      <div class="bg-[#000080] text-white px-2 py-1 flex justify-between items-center mb-2">
        <span class="text-sm font-bold tracking-tight">invitation.exe</span>
        <div class="flex gap-0.5">
          <div class="w-4 h-4 bg-[#c0c0c0] border border-white border-b-black border-r-black flex items-center justify-center text-[10px] text-black font-bold">X</div>
        </div>
      </div>

      <div class="p-6 text-center">
        <h1 class="text-2xl font-bold text-black mb-2">{{ config.hero.title }}</h1>
        <p class="text-lg text-[#000080] mb-4">
          {{ config.hero.names[0] }} & {{ config.hero.names[1] }}
        </p>
        <p class="text-sm text-gray-700 mb-6">{{ config.hero.date }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { weddingConfig as config } from '~/config/wedding.config';
</script>

<style>
/* 윈도우 95 픽셀 폰트 느낌을 위한 fallback */
body {
  cursor: url('/cursor.cur'), auto;
}
</style>