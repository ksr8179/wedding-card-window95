<script setup lang="ts">
const { shareKakaoMessage } = useKakaoShare()
const { showToast } = useToast()

const sharing = ref(false)

const shareKakao = async () => {
  if (sharing.value) return
  sharing.value = true
  const shared = await shareKakaoMessage()
  if (!shared) showToast('카카오톡 공유를 실행하지 못했습니다')
  sharing.value = false
}

const copyLink = async () => {
  const link = window.location.href

  try {
    await navigator.clipboard.writeText(link)
    showToast('청첩장 링크가 복사되었습니다')
  } catch {
    window.prompt('아래 링크를 복사해 주세요', link)
  }
}
</script>

<template>
  <section class="px-6 pb-12 pt-2">
    <p class="text-center font-sans text-[10px] uppercase tracking-invitation text-ink-faint">Share</p>
    <h2 class="mt-3 text-center font-myeongjo text-xl tracking-wide text-ink">청첩장 전하기</h2>
    <p class="mt-3 text-center font-myeongjo text-sm leading-7 text-ink-muted">
      소중한 분들께 이 초대장을 전해 주세요.
    </p>

    <div class="mt-7 space-y-2.5">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-full bg-[#FEE500] py-3 font-sans text-xs font-medium tracking-wide text-[#191600] shadow-paper transition active:scale-[0.99] disabled:opacity-60"
        :disabled="sharing"
        @click="shareKakao"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3C6.9 3 2.8 6.24 2.8 10.23c0 2.55 1.7 4.79 4.26 6.06-.19.68-.68 2.47-.78 2.85-.13.48.18.47.37.34.15-.1 2.39-1.62 3.36-2.28.64.09 1.3.14 1.99.14 5.1 0 9.2-3.24 9.2-7.11C21.2 6.24 17.1 3 12 3Z" />
        </svg>
        카카오톡으로 공유하기
      </button>

      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-full border border-wine/20 py-3 font-sans text-xs tracking-wide text-wine transition active:scale-[0.99]"
        @click="copyLink"
      >
        링크 복사하기
      </button>
    </div>
  </section>
</template>
