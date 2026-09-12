<script setup lang="ts">
import { weddingConfig } from '~/config/wedding.config'

const MAP = {
  venue: weddingConfig.schedule.venueKo,
  address: weddingConfig.schedule.address,
  lat: weddingConfig.schedule.lat,
  lng: weddingConfig.schedule.lng,
}

const { initKakaoMap, isMapLoading, mapError, mapInstance } = useKakaoMap()
const { startKakaoNavigation } = useKakaoNavi()
const { startTmapNavigation } = useTMap()

const naviParams = {
  name: MAP.venue,
  x: MAP.lng,
  y: MAP.lat,
}

const showMapOverlay = computed(() => isMapLoading.value || !!mapError.value || !mapInstance.value)

onMounted(() => {
  initKakaoMap('invitation-map', MAP.venue, { lat: MAP.lat, lng: MAP.lng, level: 3 })
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
        v-if="showMapOverlay"
        class="absolute inset-0 flex items-center justify-center bg-paper/70 font-sans text-xs text-ink-muted"
      >
        {{ mapError || '지도를 준비하고 있습니다...' }}
      </p>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-2">
      <button
        type="button"
        class="rounded-full bg-wine py-3 font-sans text-[11px] tracking-wide text-paper"
        @click="startKakaoNavigation(naviParams)"
      >
        카카오내비
      </button>
      <button
        type="button"
        class="rounded-full border border-wine/25 bg-paper-warm py-3 font-sans text-[11px] tracking-wide text-ink"
        @click="startTmapNavigation(naviParams)"
      >
        티맵
      </button>
    </div>
  </section>
</template>
