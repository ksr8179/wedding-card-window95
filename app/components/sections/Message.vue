<template>
  <div class="bg-white border border-[#808080] p-4 h-48 overflow-y-auto shadow-inner">
    <!-- 메모장 스타일의 텍스트 영역 -->
    <div class="font-['Courier_New',monospace] text-sm text-black leading-relaxed whitespace-pre-line">
      {{ config.message.title }}
      
      -------------------------
      
      {{ config.message.content }}
      
      -------------------------
      
      2026. 07. 15
      {{ config.hero.names[0] }} & {{ config.hero.names[1] }} 올림
    </div>
  </div>
</template>

<script setup lang="ts">
import { weddingConfig as config } from '~/config/wedding.config';
</script>