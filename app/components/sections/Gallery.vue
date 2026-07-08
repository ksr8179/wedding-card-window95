<template>
  <div class="grid grid-cols-1 gap-2">
    <!-- 1. API 데이터 요청 중일 때 -->
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
        <div 
          v-show="loadedImages[index]"
          class="w-full aspect-square bg-gray-500 flex items-center justify-center text-[8px] text-gray-500"
        >
          <!-- [수정] v-show와 @load를 추가하여 렌더링이 끝난 시점에만 노출 -->
          <NuxtImg 
            class="w-full h-full object-cover" 
            :src="runtimeConfig.public.supabaseUrl + config.ImgPath + img.url +'?t=' + imageTimestamp"
            loading="eager" 
            quality="80"
            format="webp"
            @load="handleImageLoad(index)"
          />
        </div>
      </div>
    </template>
    <!-- 3. 모달 뷰어 (기존 유지) -->
    <!-- 팝업 배경: items-center justify-center 유지 및 스크롤 대비 -->
    <div v-if="selectedImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      
      <!-- 팝업 창: 고전 윈도우 스타일 테두리 및 그림자 보강 -->
      <div class="bg-gradient-to-r from-[#000080] to-[#1084d0] border-2 border-t-white border-l-white border-b-gray-700 border-r-gray-700 w-full max-w-sm p-1 shadow-2xl my-auto">
        
        <!-- 타이틀 바: flex와 items-center로 X 버튼 수직 정렬 맞춤 -->
        <div class="bg-[#000080] text-white px-2 py-1 flex items-center justify-between h-6">
          <span class="text-xs font-bold font-mono">viewer.exe</span>
          <!-- X 버튼: 크기 고정 및 클릭 영역 확보 -->
          <button 
            @click="selectedImage = null" 
            class="bg-[#c0c0c0] text-black px-1.5 py-0.5 border border-t-white border-l-white border-b-black border-r-black text-[10px] active:border-b-white active:border-r-white active:border-t-black active:border-l-black font-bold h-4 flex items-center justify-center min-w-[16px]"
          >
            X
          </button>
        </div>
        
        <!-- 이미지 영역 -->
        <div class="p-2 bg-[#c0c0c0]">
          <NuxtImg
            :src="selectedImage" 
            class="w-full max-h-[70vh] object-contain border-2 border-t-gray-700 border-l-gray-700 border-b-white border-r-white bg-black"
            loading="eager" 
            quality="80"
            format="webp" 
          />
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
