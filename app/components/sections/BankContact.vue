<template>
  <div class="space-y-4">
    <div v-for="(info, key) in config.accounts" :key="key" 
         class="bg-white p-2 border border-black cursor-pointer hover:bg-gray-100"
         @click="copyToClipboard(info.number)">
      <p class="text-xs font-bold">{{ info.bank }} {{ info.number }}</p>
      <p class="text-[10px] text-gray-500">예금주: {{ info.name }} (클릭 시 복사)</p>
    </div>

    <div class="flex gap-2">
      <a :href="`tel:${config.contacts.groom}`" class="flex-1 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black text-center py-1 text-xs active:translate-y-[1px]">신랑 연락</a>
      <a :href="`tel:${config.contacts.bride}`" class="flex-1 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black text-center py-1 text-xs active:translate-y-[1px]">신부 연락</a>
    </div>

    <div v-if="showToast" class="fixed bottom-16 left-1/2 -translate-x-1/2 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black px-4 py-2 text-xs font-bold z-50">
      복사되었습니다!
    </div>
  </div>
</template>

<script setup>
import { weddingConfig as config } from '@/config/wedding.config';
const showToast = ref(false);
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  showToast.value = true;
  setTimeout(() => showToast.value = false, 2000);
};
</script>