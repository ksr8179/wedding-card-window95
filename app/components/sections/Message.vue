<template>
  <div class="flex flex-col h-[540px] md:h-[610px]">
    <div v-if="pending" class="border border-[#808080] p-1 bg-white mb-1">
      <div class="w-full aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-600">
        로딩 중...
      </div>
    </div>
    <div v-else  class="border border-[#808080] p-1 bg-white mb-1">
      <NuxtImg
        class="w-auto aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-600" 
        :src="runtimeConfig.public.supabaseUrl + config.ImgPath + data[0].url + '?t=' + Date.now()"
        format="webp"/>
    </div>

    <div class="flex-grow bg-white border border-[#808080] p-4 overflow-y-auto shadow-inner">
      <div class="font-['Courier_New',monospace] text-sm text-black leading-relaxed whitespace-pre-line">
        <span class="text-[#000000] text-sm tracking-wide">{{ displayedText }}</span>
        <span class="inline-block w-[2px] h-[1.2em] bg-black ml-1 animate-[blink_0.7s_step-end_infinite] align-middle"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { weddingConfig as config } from '~/config/wedding.config';
import { ref, onMounted } from 'vue';

const runtimeConfig = useRuntimeConfig();
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

// $fetch를 포함한 useFetch는 쿼리 내부의 ref가 바뀌면 자동으로 백엔드 API를 재호출합니다.
const { data, pending } = await useFetch('/api/gallery', {
  query: {
    gubun: "SUB"
  }
})

onMounted(() => {
  typeText();
});
</script>
