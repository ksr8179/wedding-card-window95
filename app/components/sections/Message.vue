<template>
  <div class="flex flex-col h-[540px] md:h-[815px]">
    <!-- 1. API 데이터가 아직 불러와지지 않았거나, 이미지 렌더링이 완료되지 않았을 때 -->
    <div v-if="pending || !isImageLoaded" class="border border-[#808080] p-1 bg-white mb-1">
      <div class="w-full aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-600">
        로딩 중...
      </div>
    </div>

    <!-- 2. API 데이터가 있고 이미지 렌더링도 끝났을 때 숨김 해제 -->
    <!-- v-if 대신 항상 DOM에 유지하되 조건부 노출(v-show)하여 백그라운드 로드를 트리거합니다 -->
    <div v-show="!pending && isImageLoaded" class="aspect-square border border-[#808080] p-1 bg-white mb-1">
      <!-- data가 존재할 때만 src를 안전하게 바인딩하기 위해 v-if="data?.[0]" 사용 -->
      <NuxtImg
        v-if="data?.[0]"
        class="w-full h-full object-contain bg-gray-500 flex items-center justify-center text-[8px] text-gray-600" 
        :src="runtimeConfig.public.supabaseUrl + config.ImgPath + data[0].url + '?t=' + imageTimestamp"
        fetchpriority="high"
        loading="eager"
        quality="80"
        format="webp"
        @load="handleImageLoad"
      />
    </div>

    <div v-if="showContent" class="flex-grow bg-white border border-[#808080] p-4 overflow-y-auto shadow-inner">
      <div class="font-['Courier_New',monospace] text-sm text-black leading-relaxed whitespace-pre-line">
        <span class="text-[#000000] text-sm tracking-wide">{{ displayedText }}</span>
        <span class="inline-block w-[2px] h-[1.2em] bg-black ml-1 animate-[blink_0.7s_step-end_infinite] align-middle"></span>
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
    }, 2000)
  });

  const typeText = async () => {
    for (let i = 0; i < textToType.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, typingSpeed))
      displayedText.value += textToType[i]
    }
  };
</script>
