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
        <button class="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black px-2 py-1 text-xs active:translate-y-[1px]" @click="kakaoNaviOnclick()">
          {{ isNaviLoading ? '연결 중...' : '카카오내비' }}
        </button>
        <button class="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black px-2 py-1 text-xs active:translate-y-[1px]">
          T맵
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { weddingConfig as config } from '~/config/wedding.config';

const { initMap, isMapLoading  } = useKakaoMap();
const { startNavigation, isNaviLoading  } = useKakaoNavi();

onMounted(() => {
  initMap('map-canvas', { lat: 37.5665, lng: 126.9780, level: 3 })
})

const kakaoNaviOnclick = () => {
  startNavigation({ name: '판교역', x: 127.111208, y: 37.394776 });
};
</script>