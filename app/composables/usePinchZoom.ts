const MIN_SCALE = 1
const MAX_SCALE = 4
const SWIPE_THRESHOLD = 60
const DRAG_SLOP = 8
const DOUBLE_TAP_MS = 280

type Gesture = 'idle' | 'swipe' | 'vertical' | 'pan' | 'pinch'

export const usePinchZoom = (options?: {
  onSwipePrev?: () => void
  onSwipeNext?: () => void
}) => {
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
    gesture = 'idle'
    gesturing.value = false
    pointers.clear()
  }

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
      if (swipeOffset.value <= -SWIPE_THRESHOLD) options?.onSwipeNext?.()
      else if (swipeOffset.value >= SWIPE_THRESHOLD) options?.onSwipePrev?.()
      swipeOffset.value = 0
    }

    if (pointers.size === 0) {
      gesture = 'idle'
      gesturing.value = false
      return
    }

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

  return {
    viewer,
    scale,
    viewerStyle,
    resetZoom,
    toggleZoom,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
  }
}
