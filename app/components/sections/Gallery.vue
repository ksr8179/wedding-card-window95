<template>
  <div class="grid grid-cols-1 gap-2">
    <div v-if="pending" class="cursor-pointer border border-[#808080] p-1 bg-white hover:bg-blue-100">
      <div class="w-full aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-500">
        IMAGE
      </div>
    </div>
    <div v-else
      v-for="(img, index) in data" 
      :key="index"
      @click="openModal(img.url)"
      class="cursor-pointer border border-[#808080] p-1 bg-white hover:bg-blue-100"
    >
      <img class="w-full aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-500" :src="runtimeConfig.public.supabaseUrl + config.ImgPath + img.url">
    </div>

    <div v-if="selectedImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black w-full max-w-sm p-1">
        <div class="bg-[#000080] text-white px-2 py-1 flex justify-between">
          <span class="text-xs">viewer.exe</span>
          <button @click="selectedImage = null" class="bg-[#c0c0c0] text-black px-1 border border-black text-[10px]">X</button>
        </div>
        <div class="p-2">
          <img :src="selectedImage" class="w-full border-2 border-black" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedImage = ref(null);
// $fetch를 포함한 useFetch는 쿼리 내부의 ref가 바뀌면 자동으로 백엔드 API를 재호출합니다.
const { data, pending } = await useFetch('/api/gallery', {})

const openModal = (img) => {
  selectedImage.value = img;
};
</script>