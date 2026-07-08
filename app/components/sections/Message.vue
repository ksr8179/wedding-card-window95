<template>
  <div class="flex flex-col min-h-[540px] md:min-h-[815px] h-auto">
    <!-- 1. 로딩 상태 박스 -->
    <!-- box-border와 overflow-hidden을 추가하여 박스 밖으로 탈출하는 것을 방지합니다 -->
    <div v-if="pending || !isImageLoaded" class="box-border border border-[#808080] p-1 bg-white mb-1 overflow-hidden">
      <div class="w-full aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-600">
        로딩 중...
      </div>
    </div>

    <!-- 2. 이미지 노출 박스 -->
    <!-- aspect-square 내부에서 p-1 때문에 터지는 것을 방지하기 위해 h-auto와 max-w-full 구조로 안전하게 변경합니다 -->
    <div v-show="!pending && isImageLoaded" class="w-full border border-[#808080] bg-white mb-1 box-border">
      <div class="aspect-square w-full overflow-hidden">
        <NuxtImg
          v-if="data?.[0]"
          class="w-full h-full aspect-square object-cover bg-gray-500 text-[8px] text-gray-600 border-2 border-white" 
          :src="runtimeConfig.public.supabaseUrl + config.ImgPath + data[0].url + '?t=' + imageTimestamp"
          fetchpriority="high"
          loading="eager"
          quality="80"
          format="webp"
          @load="handleImageLoad"
          @click="openModal(runtimeConfig.public.supabaseUrl + config.ImgPath + data[0].url + '?t=' + imageTimestamp)"
        />
      </div>
    </div>

    <!-- 3. 텍스트 콘텐츠 영역 -->
    <div v-if="showContent" class="flex-grow min-h-0 bg-white border border-[#808080] p-4 overflow-hidden hadow-inner">
      <div class="font-['Courier_New',monospace] text-sm text-black leading-relaxed whitespace-pre-line">
        <span class="text-[#000000] text-sm tracking-wide">{{ displayedText }}</span>
        <span class="inline-block w-[2px] h-[1.2em] bg-black ml-1 animate-[blink_0.7s_step-end_infinite] align-middle"></span>
      </div>
    </div>
  </div>
  <!-- 팝업 배경 -->
  <div v-if="selectedImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black w-full max-w-xl max-h-[90vh] p-1 flex flex-col overflow-hidden">
      
      <!-- 타이틀 바 -->
      <div class="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex items-center justify-between shrink-0">
        <span class="text-xs">viewer.exe</span>
        <button 
          @click="selectedImage = null" 
          class="bg-[#c0c0c0] text-black px-1.5 py-0.5 border border-t-white border-l-white border-b-black border-r-black text-[10px] active:border-b-white active:border-r-white active:border-t-black active:border-l-black font-bold h-4 flex items-center justify-center min-w-[16px]"
        >
          X
        </button>
      </div>
      
      <div class="p-2 bg-[#808080] flex-grow min-h-0 flex items-center justify-center overflow-hidden">
        <NuxtImg
          :src="selectedImage" 
          class="w-max-w-full max-h-full w-auto h-auto block object-contain border-2 border-white bg-black"
          loading="eager" 
          quality="80"
          format="webp" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { weddingConfig as config } from '~/config/wedding.config';
  import { ref, onMounted, watch } from 'vue'; // watch 추가

  const runtimeConfig = useRuntimeConfig();
  const textToType = config.message.title + "-------------------------" 
      + config.message.content + "-------------------------\n" 
      + config.hero.date + "  " 
      + config.hero.names[0] + "&" + config.hero.names[1] + " 올림";
  const displayedText = ref('');
  const typingSpeed = 100; // 타이핑 속도 (ms)
  const imageTimestamp = useState('imageTimestamp');
  const showContent = ref(false);
  const selectedImage = ref(null);

  // [추가] 이미지 자체의 브라우저 렌더링 완료 여부 상태 변수
  const isImageLoaded = ref(false);

  // [추가] 이미지 파일 로드가 끝났을 때 호출할 함수
  const handleImageLoad = () => {
    isImageLoaded.value = true;
  };

  // $fetch를 포함한 useFetch는 쿼리 내부의 ref가 바뀌면 자동으로 백엔드 API를 재호출합니다.
  const { data, pending } = await useFetch('/api/gallery', {
    query: {
      gubun: "SUB"
    }
  })

  // [추가] 컴포넌트가 재사용되거나 새로운 데이터를 불러올 때 로딩 상태 리셋
  watch(() => data.value, () => {
    isImageLoaded.value = false
  });

  onMounted(() => {
    setTimeout(()=>{
      showContent.value = true
      typeText();
    }, 5300)
  });

  const typeText = async () => {
    for (let i = 0; i < textToType.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, typingSpeed))
      displayedText.value += textToType[i]
    }
  };
  
  const openModal = (img) => {
    selectedImage.value = img;
  }
</script>
