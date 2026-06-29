// composables/useMapAdapter.ts
import { ref } from 'vue'

export const useKakaoMap = () => {
  const mapInstance = ref<any>(null)
  const isMapLoading = ref(false);

  const initKakaoMap = async (elementId: string, name: string,options: { lat: number; lng: number, level: number }) => {
    if (!import.meta.client) return;

    isMapLoading.value = true;
    try {
      // 1. utils의 지도 로더 호출
      const maps = await loadKakaoMap();
      
      // 2. 지도 표시할 DOM 엘리먼트 확인
      const container = document.getElementById(elementId);
      if (!container) return;

      // 3. 지도 객체 생성 및 상태 저장
      const locPosition = new maps.LatLng(options.lat, options.lng);
      mapInstance.value = new maps.Map(container, {
        center: locPosition,
        level: options.level
      });

      const marker = new maps.Marker({position : locPosition, text: name});
      marker.setMap(mapInstance.value);
    } catch (error) {
      console.error('지도 생성 실패:', error);
    } finally {
      isMapLoading.value = false;
    }
  }

  return {
    initKakaoMap,
    isMapLoading,
    mapInstance
  }
}