<script setup lang="ts">
import { getSupabasePublicConfig } from '~/utils/supabasePublic'
import { weddingConfig } from '~/config/wedding.config'

interface GalleryItem {
  id?: number
  url: string
}

const selectedIndex = ref<number | null>(null)
const { url: supabaseUrl } = getSupabasePublicConfig(useRuntimeConfig())

const { data, pending } = await useFetch<GalleryItem[]>('/api/gallery', {
  query: weddingConfig.gallery.gubun ? { gubun: weddingConfig.gallery.gubun } : {},
  key: 'wedding-gallery',
  server: false,
})

const MAX_VISIBLE = 20
const PAGE_SIZE = 10
const PAGE_AUTO_MS = 5000
const PAGE_SWIPE_THRESHOLD = 48
const PAGE_DRAG_SLOP = 8

const items = computed<GalleryItem[]>(() => {
  const payload = data.value
  if (!Array.isArray(payload)) return []
  return payload
    .filter(item => typeof item?.url === 'string' && item.url.length > 0)
    .slice(0, MAX_VISIBLE)
})

const pages = computed(() => {
  const source = items.value
  const grouped: GalleryItem[][] = []
  for (let i = 0; i < source.length; i += PAGE_SIZE) {
    grouped.push(source.slice(i, i + PAGE_SIZE))
  }
  return grouped
})

const pageCount = computed(() => pages.value.length)
const pageIndex = ref(0)
const pageDragX = ref(0)
const pageDragging = ref(false)

let pageTimer: ReturnType<typeof setInterval> | null = null
let pageStartX = 0
let pageStartY = 0
let pageGesture: 'idle' | 'swipe' | 'vertical' = 'idle'
let pagePointerActive = false
let suppressGridClick = false

const stopPageTimer = () => {
  if (!pageTimer) return
  clearInterval(pageTimer)
  pageTimer = null
}

const restartPageTimer = () => {
  stopPageTimer()
  if (!import.meta.client) return
  if (pageCount.value <= 1) return
  if (selectedIndex.value !== null) return
  pageTimer = setInterval(() => {
    pageIndex.value = (pageIndex.value + 1) % pageCount.value
  }, PAGE_AUTO_MS)
}

const goToPage = (next: number) => {
  if (pageCount.value <= 1) return
  pageIndex.value = ((next % pageCount.value) + pageCount.value) % pageCount.value
  restartPageTimer()
}

const pageTrackStyle = computed(() => ({
  transform: `translate3d(calc(${-pageIndex.value * 100}% + ${pageDragX.value}px), 0, 0)`,
  transition: pageDragging.value ? 'none' : 'transform 420ms ease',
}))

const onPagerPointerDown = (event: PointerEvent) => {
  if (pageCount.value <= 1 || (event.pointerType === 'mouse' && event.button !== 0)) return
  if (!event.isPrimary) return
  pagePointerActive = true
  pageStartX = event.clientX
  pageStartY = event.clientY
  pageGesture = 'idle'
  pageDragX.value = 0
}

const onPagerPointerMove = (event: PointerEvent) => {
  if (!pagePointerActive || pageCount.value <= 1 || !event.isPrimary) return
  const dx = event.clientX - pageStartX
  const dy = event.clientY - pageStartY

  if (pageGesture === 'idle') {
    if (Math.abs(dx) < PAGE_DRAG_SLOP && Math.abs(dy) < PAGE_DRAG_SLOP) return
    pageGesture = Math.abs(dx) > Math.abs(dy) ? 'swipe' : 'vertical'
    if (pageGesture === 'swipe') {
      pageDragging.value = true
      ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
    }
  }

  if (pageGesture === 'swipe') {
    event.preventDefault()
    pageDragX.value = dx
  }
}

const onPagerPointerUp = (event: PointerEvent) => {
  if (!pagePointerActive) return
  pagePointerActive = false
  if (pageCount.value <= 1) return
  if (pageGesture === 'swipe') {
    const dx = event.clientX - pageStartX
    if (Math.abs(dx) >= PAGE_SWIPE_THRESHOLD) {
      suppressGridClick = true
      goToPage(pageIndex.value + (dx < 0 ? 1 : -1))
    } else {
      restartPageTimer()
    }
  }
  pageDragging.value = false
  pageDragX.value = 0
  pageGesture = 'idle'
}

const onPagerClickCapture = (event: MouseEvent) => {
  if (!suppressGridClick) return
  event.preventDefault()
  event.stopPropagation()
  suppressGridClick = false
}

const imageSrc = (filename: string) => {
  if (!filename) return ''
  return `${supabaseUrl}${weddingConfig.gallery.imgPath}${filename}?v=${weddingConfig.gallery.cacheKey}`
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

const MIN_SCALE = 1
const MAX_SCALE = 4
const SWIPE_THRESHOLD = 60
const DRAG_SLOP = 8
const DOUBLE_TAP_MS = 280

type Gesture = 'idle' | 'swipe' | 'vertical' | 'pan' | 'pinch'

const viewer = ref<HTMLElement | null>(null)
const scale = ref(1)
const offset = reactive({ x: 0, y: 0 })
const swipeOffset = ref(0)
const gesturing = ref(false)

const pointers = new Map<number, { x: number; y: number }>()
let gesture: Gesture = 'idle'
let startPoint = { x: 0, y: 0 }
let startOffset = { x: 0, y: 0 }
let startScale = 1
let startDistance = 0
let lastTapAt = 0

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const resetZoom = () => {
  scale.value = 1
  offset.x = 0
  offset.y = 0
  swipeOffset.value = 0
}

// 확대한 만큼만 움직여 사진이 화면 밖으로 빠지지 않게 한다.
const clampOffset = () => {
  const el = viewer.value
  if (!el) return
  const maxX = (el.clientWidth * (scale.value - 1)) / 2
  const maxY = (el.clientHeight * (scale.value - 1)) / 2
  offset.x = clamp(offset.x, -maxX, maxX)
  offset.y = clamp(offset.y, -maxY, maxY)
}

const applyScale = (next: number) => {
  scale.value = clamp(next, MIN_SCALE, MAX_SCALE)
  if (scale.value === MIN_SCALE) {
    offset.x = 0
    offset.y = 0
    return
  }
  clampOffset()
}

const toggleZoom = () => {
  applyScale(scale.value > MIN_SCALE ? MIN_SCALE : 2.5)
}

const pointerList = () => [...pointers.values()]

const pinchDistance = () => {
  const [a, b] = pointerList()
  if (!a || !b) return 0
  return Math.hypot(a.x - b.x, a.y - b.y)
}

const onPointerDown = (event: PointerEvent) => {
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  gesturing.value = true

  if (pointers.size === 1) {
    const now = Date.now()
    if (now - lastTapAt < DOUBLE_TAP_MS) {
      toggleZoom()
      lastTapAt = 0
      gesture = 'idle'
      return
    }
    lastTapAt = now
    startPoint = { x: event.clientX, y: event.clientY }
    startOffset = { x: offset.x, y: offset.y }
    gesture = scale.value > MIN_SCALE ? 'pan' : 'idle'
    return
  }

  if (pointers.size === 2) {
    startDistance = pinchDistance()
    startScale = scale.value
    gesture = 'pinch'
    swipeOffset.value = 0
  }
}

const onPointerMove = (event: PointerEvent) => {
  if (!pointers.has(event.pointerId)) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  if (gesture === 'pinch') {
    const distance = pinchDistance()
    if (startDistance > 0 && distance > 0) applyScale(startScale * (distance / startDistance))
    return
  }

  const dx = event.clientX - startPoint.x
  const dy = event.clientY - startPoint.y

  if (gesture === 'pan') {
    offset.x = startOffset.x + dx
    offset.y = startOffset.y + dy
    clampOffset()
    return
  }

  if (gesture === 'idle') {
    if (Math.abs(dx) < DRAG_SLOP && Math.abs(dy) < DRAG_SLOP) return
    gesture = Math.abs(dx) > Math.abs(dy) ? 'swipe' : 'vertical'
  }

  if (gesture === 'swipe') swipeOffset.value = dx
}

const onPointerUp = (event: PointerEvent) => {
  pointers.delete(event.pointerId)

  if (gesture === 'swipe') {
    if (swipeOffset.value <= -SWIPE_THRESHOLD) showNext()
    else if (swipeOffset.value >= SWIPE_THRESHOLD) showPrev()
    swipeOffset.value = 0
  }

  if (pointers.size === 0) {
    gesture = 'idle'
    gesturing.value = false
    return
  }

  // 핀치 중 한 손가락만 떼면 남은 손가락으로 이동을 이어받는다.
  const [remaining] = pointerList()
  if (remaining) {
    startPoint = { x: remaining.x, y: remaining.y }
    startOffset = { x: offset.x, y: offset.y }
    gesture = scale.value > MIN_SCALE ? 'pan' : 'idle'
  }
}

const onWheel = (event: WheelEvent) => {
  event.preventDefault()
  applyScale(scale.value - event.deltaY * 0.003)
}

const viewerStyle = computed(() => ({
  transform: `translate3d(${offset.x + swipeOffset.value}px, ${offset.y}px, 0) scale(${scale.value})`,
  transition: gesturing.value ? 'none' : 'transform 200ms ease-out',
}))

watch(selectedIndex, (value) => {
  resetZoom()
  if (!import.meta.client) return
  document.body.style.overflow = value === null ? '' : 'hidden'
  restartPageTimer()
})

watch(pageCount, (count) => {
  if (pageIndex.value >= count) pageIndex.value = Math.max(count - 1, 0)
  restartPageTimer()
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  restartPageTimer()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  stopPageTimer()
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

    <div
      v-else
      class="mt-8 overflow-hidden touch-pan-y"
      @pointerdown="onPagerPointerDown"
      @pointermove="onPagerPointerMove"
      @pointerup="onPagerPointerUp"
      @pointercancel="onPagerPointerUp"
      @click.capture="onPagerClickCapture"
    >
      <div class="flex will-change-transform" :style="pageTrackStyle">
        <div
          v-for="(page, pageIdx) in pages"
          :key="pageIdx"
          class="grid w-full shrink-0 basis-full grid-cols-2 gap-2"
        >
          <button
            v-for="(img, index) in page"
            :key="img.id ?? `${img.url}-${pageIdx * PAGE_SIZE + index}`"
            type="button"
            class="group relative aspect-square overflow-hidden rounded-xl bg-sky-photo shadow-paper"
            @click="openModal(pageIdx * PAGE_SIZE + index)"
          >
            <img
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              :src="imageSrc(img.url)"
              alt="웨딩 갤러리 사진"
            >
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="!pending && pageCount > 1"
      class="mt-4 flex items-center justify-center gap-1.5"
      aria-hidden="true"
    >
      <span
        v-for="n in pageCount"
        :key="n"
        class="h-1.5 w-1.5 rounded-full transition-colors"
        :class="n - 1 === pageIndex ? 'bg-wine' : 'bg-wine/25'"
      />
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
            <div
              ref="viewer"
              class="relative h-[70vh] touch-none select-none overflow-hidden rounded-xl bg-wine-deep/5"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointercancel="onPointerUp"
              @wheel="onWheel"
              @dblclick="toggleZoom"
            >
              <img
                :src="selectedSrc"
                class="pointer-events-none h-full w-full object-contain will-change-transform"
                :style="viewerStyle"
                draggable="false"
                alt="선택한 웨딩 사진"
              >
              <button
                v-if="scale > 1"
                type="button"
                class="absolute bottom-2 right-2 rounded-full bg-wine/80 px-3 py-1.5 font-sans text-[10px] text-paper"
                @click.stop="resetZoom"
              >
                원래 크기
              </button>
            </div>
            <p class="mt-2 text-center font-sans text-[10px] text-ink-faint">
              두 손가락으로 확대 · 좌우로 밀어 사진 넘기기
            </p>
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
