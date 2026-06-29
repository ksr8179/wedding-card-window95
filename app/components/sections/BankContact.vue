<template>
  <div class="space-y-4">
    <fieldset class="border-2 border-[#c0c0c0] border-t-white border-l-white border-b-[#808080] border-r-[#808080] p-2">
      <legend class="px-2 text-xs font-bold text-[#000080]">신랑측</legend>
      <div class="space-y-2">
        <div v-for="person in groomSide" :key="person.name" 
             @click="copyToClipboard(person.number)"
             class="flex justify-between items-center bg-white border border-[#808080] p-1.5 cursor-pointer hover:bg-blue-100">
          <div>
            <p class="text-[10px] text-gray-500">{{ person.relation }}</p>
            <p class="text-xs font-bold">{{ person.name }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px]">{{ person.bank }}</p>
            <p class="text-xs">{{ person.number }}</p>
          </div>
        </div>
      </div>
    </fieldset>

    <fieldset class="border-2 border-[#c0c0c0] border-t-white border-l-white border-b-[#808080] border-r-[#808080] p-2">
      <legend class="px-2 text-xs font-bold text-[#000080]">신부측</legend>
      <div class="space-y-2">
        <div v-for="person in brideSide" :key="person.name" 
             @click="copyToClipboard(person.number)"
             class="flex justify-between items-center bg-white border border-[#808080] p-1.5 cursor-pointer hover:bg-blue-100">
          <div>
            <p class="text-[10px] text-gray-500">{{ person.relation }}</p>
            <p class="text-xs font-bold">{{ person.name }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px]">{{ person.bank }}</p>
            <p class="text-xs">{{ person.number }}</p>
          </div>
        </div>
      </div>
    </fieldset>

    <div v-if="showToast" class="fixed bottom-16 left-1/2 -translate-x-1/2 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black px-4 py-2 text-xs font-bold z-50">
      복사되었습니다!
    </div>
  </div>
</template>

<script setup>
// config에서 리스트 형태로 가져온다고 가정
const groomSide = [
  { relation: '신랑', name: '김성래', bank: '국민', number: '123-456' },
  { relation: '부', name: '김OO', bank: '신한', number: '111-222' }
];
const brideSide = [
  { relation: '신부', name: '장혜민', bank: '우리', number: '987-654' },
  // 추가 인원...
];

const showToast = ref(false);

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  showToast.value = true;
  setTimeout(() => showToast.value = false, 2000);
};
</script>