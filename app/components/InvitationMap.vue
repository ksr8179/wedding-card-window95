<script setup lang="ts">
import { weddingConfig } from '~/config/wedding.config'

const MAP = {
  venue: weddingConfig.schedule.venueKo,
  address: weddingConfig.schedule.address,
  lat: weddingConfig.schedule.lat,
  lng: weddingConfig.schedule.lng,
}

const runtimeConfig = useRuntimeConfig()
const kakaoJsKey = computed(() => String(runtimeConfig.public.kakaoJsKey || runtimeConfig.public.kakaoApiKey || ''))
const mapReady = ref(false)
const mapError = ref('')
const { openKakaoNavi, openTmap } = useInvitationNavi()

useHead(() => ({
  script: kakaoJsKey.value
    ? [
        {
          key: 'kakao-maps-sdk',
          src: `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoJsKey.value}&autoload=false`,
          async: true,
          defer: true,
          tagPriority: 20,
        },
      ]
    : [],
}))

const waitForKakao = (): Promise<typeof window.kakao> => {
  return new Promise((resolve, reject) => {
    const started = Date.now()
    const tick = () => {
      if (window.kakao?.maps?.load) {
        resolve(window.kakao)
        return
      }
      if (Date.now() - started > 8000) {
        reject(new Error('Kakao Maps SDK timeout'))
        return
      }
      window.setTimeout(tick, 80)
    }
    tick()
  })
}

onMounted(async () => {
  if (!import.meta.client) return
  if (!kakaoJsKey.value) {
    mapError.value = '카카오 지도 키가 설정되지 않았습니다.'
    return
  }

  try {
    const kakao = await waitForKakao()
    kakao.maps.load(() => {
      const container = document.getElementById('invitation-map')
      if (!container) return
      const center = new kakao.maps.LatLng(MAP.lat, MAP.lng)
      const map = new kakao.maps.Map(container, {
        center,
        level: 3,
      })
      const marker = new kakao.maps.Marker({ position: center })
      marker.setMap(map)
      mapReady.value = true
    })
  } catch (error) {
    console.error(error)
    mapError.value = '지도를 불러오지 못했습니다.'
  }
})
</script>

<template>
  <section class="px-6 py-12">
    <p class="text-center font-sans text-[10px] uppercase tracking-invitation text-ink-faint">Location</p>
    <h2 class="mt-3 text-center font-myeongjo text-xl tracking-wide text-ink">오시는 길</h2>
    <p class="mt-4 text-center font-serif text-lg text-ink">{{ MAP.venue }}</p>
    <p class="mt-1 text-center font-sans text-xs leading-6 text-ink-muted">{{ MAP.address }}</p>

    <div class="relative mt-6 overflow-hidden rounded-2xl border border-wine/10 bg-sky-photo/30 shadow-paper">
      <div id="invitation-map" class="h-56 w-full" />
      <p
        v-if="!mapReady"
        class="absolute inset-0 flex items-center justify-center bg-paper/70 font-sans text-xs text-ink-muted"
      >
        {{ mapError || '지도를 준비하고 있습니다...' }}
      </p>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-2">
      <button
        type="button"
        class="rounded-full bg-wine py-3 font-sans text-[11px] tracking-wide text-paper"
        @click="openKakaoNavi({ name: MAP.venue, lat: MAP.lat, lng: MAP.lng })"
      >
        카카오내비로 오시기
      </button>
      <button
        type="button"
        class="rounded-full border border-wine/25 bg-paper-warm py-3 font-sans text-[11px] tracking-wide text-ink"
        @click="openTmap({ name: MAP.venue, lat: MAP.lat, lng: MAP.lng })"
      >
        티맵으로 오시기
      </button>
    </div>
  </section>
</template>
