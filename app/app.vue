<template>
  <div class="min-h-screen bg-wine-deep">
    <div class="mx-auto min-h-screen w-full max-w-md overflow-x-hidden bg-wine shadow-phone">
      <div class="px-2 py-4 sm:px-3 sm:py-6">
        <div class="relative overflow-hidden rounded-[42px] border-[10px] border-paper-lace bg-paper-lace shadow-[0_0_0_1px_rgba(255,255,255,0.4)]">
          <div class="pointer-events-none absolute inset-0 scallop-border" />
          <div class="paper-grain relative m-[14px] min-h-[calc(100vh-3.5rem)] rounded-[28px]">
            <InvitationReveal>
              <InvitationCover />
            </InvitationReveal>
            <div class="mx-8 h-px bg-wine/10" />
            <InvitationReveal delay="80ms">
              <InvitationGreeting />
            </InvitationReveal>
            <div class="mx-8 h-px bg-wine/10" />
            <InvitationReveal delay="120ms">
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
              <p class="font-script text-2xl text-wine">Seong rae & Hye min</p>
              <p class="mt-2 font-sans text-[10px] tracking-invitation text-ink-faint">JANUARY 30, 2027</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
    <InvitationToast />
  </div>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'bg-wine-deep',
  },
})
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
