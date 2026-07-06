// composables/useAudio.js
import { ref } from 'vue'

export const useSound = (audioUrl) => {
  const audio = ref(null)

  // 1. 오디오 재생 함수 (사용자 상호작용으로 실행되므로 브라우저 환경이 보장됨)
  const play = () => {
    if (!process.client) return

    // 싱글톤처럼 최초 실행 시점에만 Audio 객체 생성
    if (!audio.value) {
      audio.value = new Audio(audioUrl)
    }
    audio.volume = 0.8; // 볼륨 조절 (0.0 ~ 1.0)
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
