// composables/useAudio.js
import { ref, onMounted } from 'vue'

export const useSound = (audioUrl) => {
  const audio = ref(null)
  
  onMounted(() => {
    if (process.client) {
      audio = new Audio(audioUrl)
      audio.load() // 💡 미리 로드 명령
    }
  })

  // 1. 오디오 재생 함수 (사용자 상호작용으로 실행되므로 브라우저 환경이 보장됨)
  const play = () => {
    audio.value.play().catch(err => {
      console.error("오디오 재생 실패:", err)
    })
  }

  // 2. 오디오 일시정지 함수
  const pause = () => {
    if (audio.value) {
      audio.value.pause()
    }
  }

  return {
    play,
    pause
  }
}
