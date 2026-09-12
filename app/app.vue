<template>
  <div class="min-h-screen bg-wine-deep">
    <div class="relative mx-auto min-h-screen w-full max-w-md bg-wine shadow-phone">
      <div class="px-2 py-4 sm:px-3 sm:py-6">
        <div class="relative overflow-hidden rounded-[42px] border-[10px] border-paper-lace bg-paper-lace shadow-[0_0_0_1px_rgba(255,255,255,0.4)]">
          <div class="pointer-events-none absolute inset-0 scallop-border" />
          <div class="paper-grain relative m-[14px] min-h-[calc(100vh-3.5rem)] rounded-[28px]">
            <button
              v-if="opened"
              type="button"
              class="absolute right-4 top-4 z-40 whitespace-nowrap rounded-full bg-wine px-3.5 py-2 font-sans text-[10px] tracking-wide text-paper shadow-paper"
              :aria-label="isPlaying ? '음악 종료' : '음악 재생'"
              @click="toggleMusic"
            >
              {{ isPlaying ? '음악 끄기' : '음악 켜기' }}
            </button>

            <InvitationWelcome v-if="!opened" @open="openInvitation" />

            <div v-else class="pt-10">
              <InvitationReveal>
                <InvitationCover />
              </InvitationReveal>
              <div class="mx-8 h-px bg-wine/10" />
              <InvitationReveal delay="80ms">
                <InvitationGreeting />
              </InvitationReveal>
              <div class="mx-8 h-px bg-wine/10" />
              <InvitationReveal delay="120ms">
                <SectionsGallery />
              </InvitationReveal>
              <div class="mx-8 h-px bg-wine/10" />
              <InvitationReveal delay="140ms">
                <InvitationAccount />
              </InvitationReveal>
              <div class="mx-8 h-px bg-wine/10" />
              <InvitationReveal delay="160ms">
                <InvitationMap />
              </InvitationReveal>
              <div class="mx-8 h-px bg-wine/10" />
              <InvitationReveal delay="200ms">
                <Guestbook />
              </InvitationReveal>
              <footer class="px-6 pb-12 pt-2 text-center">
                <p class="font-script text-2xl text-wine">Sung rae & Hye min</p>
                <p class="mt-2 font-sans text-[10px] tracking-invitation text-ink-faint">JANUARY 30, 2027</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
    <InvitationToast />
  </div>
</template>

<script setup lang="ts">
const opened = ref(false)
const { play, stop, isPlaying } = useSound()
const { showToast } = useToast()

useHead({
  bodyAttrs: {
    class: 'bg-wine-deep',
  },
})

const openInvitation = () => {
  opened.value = true
  void play()
}

const toggleMusic = async () => {
  if (isPlaying.value) {
    stop()
    showToast('배경음악을 종료했습니다')
    return
  }
  await play()
  showToast(isPlaying.value ? '배경음악을 재생합니다' : '음악 파일을 확인해 주세요')
}
</script>

<style scoped>
.scallop-border {
  background:
    radial-gradient(circle at 12px 12px, transparent 9px, #fffdf8 9.5px) top left / 24px 24px repeat;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  padding: 12px;
}
</style>
