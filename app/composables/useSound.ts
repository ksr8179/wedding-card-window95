import { weddingConfig } from '~/config/wedding.config'

export const useSound = (audioUrl?: string) => {
  const src = audioUrl ?? weddingConfig.music.src
  const isPlaying = useState('wedding-bgm-playing', () => false)
  const player = useState<HTMLAudioElement | null>('wedding-bgm-el', () => null)

  const ensure = () => {
    if (!import.meta.client) return null
    if (!player.value) {
      const el = new Audio(src)
      el.loop = true
      el.preload = 'auto'
      el.volume = weddingConfig.music.volume
      el.addEventListener('play', () => {
        isPlaying.value = true
      })
      el.addEventListener('pause', () => {
        isPlaying.value = false
      })
      player.value = el
    }
    return player.value
  }

  const play = async () => {
    const el = ensure()
    if (!el) return
    try {
      await el.play()
    } catch (error) {
      console.error('오디오 재생 실패:', error)
    }
  }

  const pause = () => {
    player.value?.pause()
  }

  const stop = () => {
    if (!player.value) return
    player.value.pause()
    player.value.currentTime = 0
  }

  const toggle = async () => {
    if (isPlaying.value) {
      stop()
      return
    }
    await play()
  }

  return {
    play,
    pause,
    stop,
    toggle,
    isPlaying,
  }
}
