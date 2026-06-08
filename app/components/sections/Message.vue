<template>
  <div class="bg-white border border-[#808080] p-4 h-48 overflow-y-auto shadow-inner">
    <!-- 메모장 스타일의 텍스트 영역 -->
    <div class="font-['Courier_New',monospace] text-sm text-black leading-relaxed whitespace-pre-line">
      <span class="text-[#000000] text-sm tracking-wide">{{ displayedText }}</span>
      <span class="inline-block w-[2px] h-[1.5em] bg-current ml-1 animate-[blink_0.7s_step-end_infinite] vertical-middle"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { weddingConfig as config } from '~/config/wedding.config';
import { ref, onMounted } from 'vue';

const textToType = config.message.title + "-------------------------" 
    + config.message.content + "-------------------------\n" 
    + config.hero.date + "  " 
    + config.hero.names[0] + "&" + config.hero.names[1] + " 올림";
const displayedText = ref('');
const typingSpeed = 100; // 타이핑 속도 (ms)

const typeText = async () => {
  for (let i = 0; i < textToType.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, typingSpeed));
    displayedText.value += textToType[i];
  }
};

onMounted(() => {
  typeText();
});
</script>
