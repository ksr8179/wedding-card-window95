<template>
  <div class="grid grid-cols-1 gap-2">
    <!-- 1. API 데이터 요청 중일 때 -->
    <Transition 
        name="retro"
        mode="out-in"
        enter-active-class="duration-75 ease-linear"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="duration-75 ease-linear"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95">
      <div v-if="pending" class="cursor-pointer border border-[#808080] p-1 bg-white hover:bg-blue-100">
        <div class="w-full aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-500">
          로딩 중...
        </div>
      </div>

      <!-- 2. API 데이터 로드 완료 후 -->
      <template v-else>
        <div 
          v-for="(img, index) in data" 
          :key="index"
          @click="openModal(runtimeConfig.public.supabaseUrl + config.ImgPath + img.url +'?t=' + imageTimestamp)"
          class="cursor-pointer border border-[#808080] p-1 bg-white hover:bg-blue-100"
        >
          <!-- [추가] 실제 이미지가 화면에 렌더링되기 전까지 보여줄 플레이스홀더 -->
          <div 
            v-if="!loadedImages[index]" 
            class="w-full aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-500"
          >
            로딩 중...
          </div>

          <!-- [수정] v-show와 @load를 추가하여 렌더링이 끝난 시점에만 노출 -->
          <NuxtImg 
            v-show="loadedImages[index]"
            class="w-auto aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-500" 
            :src="runtimeConfig.public.supabaseUrl + config.ImgPath + img.url +'?t=' + imageTimestamp"
            loading="eager" 
            quality="80"
            format="webp"
            @load="handleImageLoad(index)"
          />
        </div>
      </template>
    </Transition>
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
  import { ref, watch } from 'vue'; // watch 추가

  const runtimeConfig = useRuntimeConfig();
  const selectedImage = ref(null);
  const imageTimestamp = useState('imageTimestamp')

  // $fetch를 포함한 useFetch는 쿼리 내부의 ref가 바뀌면 자동으로 백엔드 API를 재호출합니다.
  const { data, pending } = await useFetch('/api/gallery', {})

  // [추가] 각 이미지의 렌더링 완료 상태를 인덱스별로 관리할 반응형 배열
  const loadedImages = ref([]);

  // [추가] useFetch로 데이터가 정상적으로 들어오면 이미지 개수만큼 false 배열 초기화
  watch(() => data.value, (newData) => {
    if (newData && Array.isArray(newData)) {
      loadedImages.value = new Array(newData.length).fill(false);
    }
  }, { immediate: true });

  // [추가] 특정 인덱스의 이미지가 완료되었을 때 실행할 함수
  const handleImageLoad = (index) => {
    loadedImages.value[index] = true;
  };

  const openModal = (img) => {
    selectedImage.value = img;
  }
</script>
