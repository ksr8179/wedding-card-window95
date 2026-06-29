<template>
  <div class="space-y-4">
    <div class="flex items-center gap-4 bg-[#c0c0c0] p-2 border border-white border-b-[#808080] border-r-[#808080]">
      <div class="w-10 h-10 bg-white border border-black flex flex-col items-center justify-center">
        <span class="text-[10px] text-red-600 font-bold">JUL</span>
        <span class="text-lg font-bold">15</span>
      </div>
      <div>
        <p class="font-bold text-sm">{{ config.schedule.date }}</p>
        <p class="text-xs text-gray-600">{{ config.schedule.time }}</p>
      </div>
    </div>

    <div class="text-sm border-t border-gray-400 pt-3">
      <p class="mb-2 font-bold underline">LOCATION</p>
      <p class="mb-2 text-gray-800">{{ config.schedule.location }}</p>
      <div
          class="mb-2 border border-[#808080] p-1 bg-white"
        >
        <div id="map-canvas" class="w-full aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-500">
        </div>
        <div v-if="isMapLoading" class="w-full aspect-square bg-gray-300 flex items-center justify-center text-[8px] text-gray-500">
            로딩중...
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-2">
        <button 
          class="flex items-center justify-center gap-2 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black px-2 py-1 text-xs active:translate-y-[1px]" 
          @click = "kakaoNaviOnclick()"
        >
          <img src="~/assets/img/kakao-navi.png" alt="카카오내비" class="w-4 h-4 border-none rounded-md" />
          <span>카카오내비</span>
        </button>

        <button 
          class="flex items-center justify-center gap-2 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black px-2 py-1 text-xs active:translate-y-[1px]"
          @click = "tmapNaviOnclick()"
          >
          <img src="~/assets/img/tmap.png" alt="T맵" class="w-4 h-4 border-none rounded-md" />
          <span>T맵</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { weddingConfig as config } from '~/config/wedding.config';

const { initKakaoMap, isMapLoading  } = useKakaoMap();
const { startKakaoNavigation } = useKakaoNavi();
const { startTmapNavigation } = useTMap();

onMounted(() => {
  initKakaoMap('map-canvas', '판교역', { lat: 37.394776, lng: 127.111208, level: 3 });
})

const kakaoNaviOnclick = () => {
  startKakaoNavigation({ name: '판교역', x: 127.111208, y: 37.394776 });
};

const tmapNaviOnclick = () => {
  startTmapNavigation({ name: '판교역', x: 127.111208, y: 37.394776 });
};
</script>