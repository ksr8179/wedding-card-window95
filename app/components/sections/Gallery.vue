<template>
  <div class="grid grid-cols-1 gap-2">
    <!-- 1. API 데이터 요청 중일 때 -->
    <div v-if="pending" class="cursor-pointer border border-[#808080] p-1 bg-white hover:bg-blue-100">
      <div class="w-full aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-500">
        로딩 중...
      </div>
    </div>

    <!-- 2. API 데이터 로드 완료 후 -->
    <!-- TransitionGroup을 사용하여 내부 v-for 리스트의 애니메이션을 안전하게 격리합니다 -->
    <TransitionGroup v-else name="retro"
      mode="out-in"
      enter-active-class="duration-75 ease-linear"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-75 ease-linear"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
	    tag="div">
      <div 
        v-for="(img, index) in data" 
        :key="index"
        @click="openModal(runtimeConfig.public.supabaseUrl + config.ImgPath + img.url +'?t=' + imageTimestamp)"
        class="relative cursor-pointer border border-[#808080] p-1 bg-white hover:bg-blue-100 overflow-hidden"
      >
        <!-- 2-A. 실제 이미지가 화면에 렌더링되기 전까지 보여줄 플레이스홀더 -->
        <!-- 개별 요소로 인식되도록 고유 키(key)를 조합해 바인딩합니다 -->
        <div 
          v-if="!loadedImages[index]" 
          :key="'loading-' + index"
          class="absolute inset-1 bg-gray-300 flex items-center justify-center text-[8px] text-gray-500 z-10"
        >
          로딩 중...
        </div>

        <!-- 2-B. 실제 이미지 (v-show 대신 블록 스타일 제어로 레트로 감성 전환) -->
        <NuxtImg 
          :key="'img-' + index"
          class="w-auto aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-500" 
          :class="(loadedImages[index]) ? 'block' : 'invisible'"
          :src="runtimeConfig.public.supabaseUrl + config.ImgPath + img.url +'?t=' + imageTimestamp"
          loading="eager" 
          quality="80"
          format="webp"
          @load="handleImageLoad(index)"
        />
      </div>
    </TransitionGroup>

    <!-- 3. 모달 뷰어 (기존 유지) -->
    <div v-if="selectedImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black w-full max-w-sm p-1">
        <div class="bg-[#000080] text-white px-2 py-1 flex justify-between">
          <span class="text-xs">viewer.exe</span>
          <button @click="selectedImage = null" class="bg-[#c0c0c0] text-black px-1 border border-black text-[10px]">X</button>
        </div>
        <div class="p-2">
          <NuxtImg
            :src="selectedImage" class="w-full border-2 border-black"
            loading="eager" 
            quality="80"
            format="webp" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { weddingConfig as config } from '~/config/wedding.config';
  import { ref, watch } from 'vue';

  const runtimeConfig = useRuntimeConfig();
  const selectedImage = ref(null);
  const imageTimestamp = useState('imageTimestamp')

  const { data, pending } = await useFetch('/api/gallery', {})

  const loadedImages = ref([]);

  watch(() => data.value, (newData) => {
    if (newData && Array.isArray(newData)) {
      loadedImages.value = new Array(newData.length).fill(false);
    }
  }, { immediate: true });

  const handleImageLoad = (index) => {
    loadedImages.value[index] = true;
  };

  const openModal = (img) => {
    selectedImage.value = img;
  }
</script>