export const useKakaoMap = () => {
  const mapInstance = ref<any>(null)
  const isMapLoading = ref(false)
  const mapError = ref('')

  const initKakaoMap = async (elementId: string, name: string, options: { lat: number; lng: number; level: number }) => {
    if (!import.meta.client) return

    const config = useRuntimeConfig()
    const appKey = String(config.public.kakaoApiKey || config.public.kakaoJsKey || '')
    if (!appKey) {
      mapError.value = '카카오 지도 키가 설정되지 않았습니다.'
      return
    }

    isMapLoading.value = true
    mapError.value = ''
    try {
      const maps = await loadKakaoMap()

      const container = document.getElementById(elementId)
      if (!container) {
        mapError.value = '지도를 불러오지 못했습니다.'
        return
      }

      const locPosition = new maps.LatLng(options.lat, options.lng)
      mapInstance.value = new maps.Map(container, {
        center: locPosition,
        level: options.level,
      })

      const marker = new maps.Marker({ position: locPosition, text: name })
      marker.setMap(mapInstance.value)
    } catch (error) {
      console.error('지도 생성 실패:', error)
      mapError.value = '지도를 불러오지 못했습니다.'
    } finally {
      isMapLoading.value = false
    }
  }

  return {
    initKakaoMap,
    isMapLoading,
    mapError,
    mapInstance,
  }
}