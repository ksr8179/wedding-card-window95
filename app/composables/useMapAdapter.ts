// composables/useMapAdapter.ts
import { ref } from 'vue'

export const useMapAdapter = () => {
  const currentEngine = ref<'kakao' | 'naver'>('kakao')
  const mapInstance = ref<any>(null)

  // 1. 스크립트 로드 유틸리티
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve()
      const script = document.createElement('script')
      script.src = src
      script.defer = true
      script.onload = () => resolve()
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // 2. 지도 초기화 (공통 인터페이스)
  const initMap = async (elementId: string, options: { lat: number; lng: number }) => {
    if (currentEngine.value === 'kakao') {
        const APP_KEY = "";
        const src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false`;
        // 1. 기존에 남아있는 카카오 스크립트 제거 (HMR 충돌 방지)
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            existingScript.remove();
        }

        await loadScript(src);
        // @ts-ignore
        // 2. 카카오 SDK 내부 리소스까지 완벽히 로드된 후 실행되도록 보장
        return new Promise<void>((resolve) => {
            // @ts-ignore
            window.kakao.maps.load(() => {
                const container = document.getElementById(elementId);
                if (container) {
                    const options = {
                        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
                        level: 3
                    }
                    
                    // @ts-ignore
                    mapInstance.value = new window.kakao.maps.Map(container, options);

                    const markerPosition = new window.kakao.maps.LatLng(37.5665, 126.9780);

                    const marker = new window.kakao.maps.Marker({position : markerPosition, text: '서울시청'});

                    marker.setMap(mapInstance.value);
                }
                resolve();
            })
        })
    } else {
      await loadScript('https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_KEY')
      // @ts-ignore
      mapInstance.value = new google.maps.Map(document.getElementById(elementId), {
        center: options,
        zoom: 15
      })
    }
  }

  // 3. 엔진 전환 함수
  const switchEngine = (engine: 'kakao' | 'naver') => {
    currentEngine.value = engine
    // 필요 시 기존 mapInstance 파괴 로직 추가
  }

  return {
    currentEngine,
    initMap,
    switchEngine,
    mapInstance
  }
}