<script setup lang="ts">
import { getSupabasePublicConfig } from '~/utils/supabasePublic'
import { weddingConfig as config } from '~/config/wedding.config'

interface GalleryItem {
  id?: number
  url: string
}

const runtimeConfig = useRuntimeConfig()
const selectedIndex = ref<number | null>(null)

const { url: supabaseUrl } = getSupabasePublicConfig(runtimeConfig)

const { data, pending } = await useFetch<GalleryItem[]>('/api/gallery', {
  query: config.gallery.gubun ? { gubun: config.gallery.gubun } : {},
})

const items = computed<GalleryItem[]>(() => {
  const payload = data.value
  if (!Array.isArray(payload)) return []
  return payload.filter(item => typeof item?.url === 'string' && item.url.length > 0)
})

const imageSrc = (filename: string) => {
  return `${supabaseUrl}${config.gallery.imgPath}${filename}`
}

const selectedSrc = computed(() => {
  if (selectedIndex.value === null) return ''
  return imageSrc(items.value[selectedIndex.value]?.url ?? '')
})

const openModal = (index: number) => {
  selectedIndex.value = index
}

const closeModal = () => {
  selectedIndex.value = null
}

const showPrev = () => {
  if (selectedIndex.value === null || !items.value.length) return
  selectedIndex.value = (selectedIndex.value + items.value.length - 1) % items.value.length
}

const showNext = () => {
  if (selectedIndex.value === null || !items.value.length) return
  selectedIndex.value = (selectedIndex.value + 1) % items.value.length
}

const onKeydown = (event: KeyboardEvent) => {
  if (selectedIndex.value === null) return
  if (event.key === 'Escape') closeModal()
  if (event.key === 'ArrowLeft') showPrev()
  if (event.key === 'ArrowRight') showNext()
}

watch(selectedIndex, (value) => {
  if (!import.meta.client) return
  document.body.style.overflow = value === null ? '' : 'hidden'
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <section class="px-6 py-12">
    <p class="text-center font-sans text-[10px] uppercase tracking-invitation text-ink-faint">Gallery</p>
    <h2 class="mt-3 text-center font-myeongjo text-xl tracking-wide text-ink">우리의 순간</h2>
    <p class="mt-3 text-center font-myeongjo text-sm leading-7 text-ink-muted">
      사진을 누르면 크게 볼 수 있습니다.
    </p>

    <div v-if="pending" class="mt-8 grid grid-cols-2 gap-2">
      <div
        v-for="n in 4"
        :key="n"
        class="aspect-square animate-pulse rounded-xl bg-wine/10"
      />
    </div>

    <div v-else class="mt-8 grid grid-cols-2 gap-2">
      <button
        v-for="(img, index) in items"
        :key="img.id ?? `${img.url}-${index}`"
        type="button"
        class="group relative aspect-square overflow-hidden rounded-xl bg-sky-photo shadow-paper"
        @click="openModal(index)"
      >
        <img
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          :src="imageSrc(img.url)"
          alt="웨딩 갤러리 사진"
        >
      </button>
    </div>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="selectedIndex !== null"
          class="fixed inset-0 z-[90] flex items-center justify-center bg-wine-deep/80 p-4 backdrop-blur-sm"
          @click="closeModal"
        >
          <div
            class="relative w-full max-w-md overflow-hidden rounded-2xl bg-paper-lace p-3 shadow-phone"
            @click.stop
          >
            <div class="flex items-center justify-between px-1 pb-2">
              <p class="font-sans text-[10px] uppercase tracking-invitation text-ink-faint">
                {{ (selectedIndex ?? 0) + 1 }} / {{ items.length }}
              </p>
              <button
                type="button"
                class="rounded-full bg-wine px-3 py-1 font-sans text-[11px] text-paper"
                @click="closeModal"
              >
                닫기
              </button>
            </div>
            <img
              :src="selectedSrc"
              class="max-h-[70vh] w-full rounded-xl object-contain"
              alt="선택한 웨딩 사진"
            >
            <div class="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                class="rounded-full border border-wine/20 py-2 font-sans text-[11px] text-ink"
                @click="showPrev"
              >
                이전
              </button>
              <button
                type="button"
                class="rounded-full bg-wine py-2 font-sans text-[11px] text-paper"
                @click="showNext"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
