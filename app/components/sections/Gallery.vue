<template>
  <div class="grid grid-cols-3 gap-2">
    <div 
      v-for="(img, index) in galleryImages" 
      :key="index"
      @click="openModal(img)"
      class="cursor-pointer border border-[#808080] p-1 bg-white hover:bg-blue-100"
    >
      <div class="w-full aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-500">
        IMAGE_{{ index + 1 }}
      </div>
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
const galleryImages = ['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg', '/img5.jpg', '/img6.jpg'];
const selectedImage = ref(null);

const openModal = (img) => {
  selectedImage.value = img;
};
</script>