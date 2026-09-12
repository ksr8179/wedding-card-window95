<script setup lang="ts">
import { weddingConfig } from '~/config/wedding.config'

const WELCOME = {
  title: weddingConfig.couple.title,
  groom: weddingConfig.couple.groom,
  bride: weddingConfig.couple.bride,
  date: weddingConfig.schedule.dateEn,
  photo: weddingConfig.photos.welcome,
}

const emit = defineEmits<{
  open: []
}>()

const opening = ref(false)

const onOpen = () => {
  if (opening.value) return
  opening.value = true
  emit('open')
}
</script>

<template>
  <section
    class="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-8 py-16 text-center"
    :class="opening ? 'animate-soft-in opacity-0' : ''"
  >
    <p class="font-sans text-[10px] uppercase tracking-invitation text-ink-faint">Wedding Invitation</p>
    <p class="mt-5 font-script text-[2.4rem] leading-[1.15] text-ink">
      {{ WELCOME.title }}
    </p>
    <div class="mt-8 h-48 w-40 overflow-hidden bg-sky-photo shadow-paper">
      <img
        :src="WELCOME.photo"
        :alt="`${WELCOME.groom.ko}와 ${WELCOME.bride.ko}`"
        class="h-full w-full object-cover"
      >
    </div>
    <p class="mt-8 font-script text-2xl text-ink">
      {{ WELCOME.groom.en }}
      <span class="mx-1 text-lg italic">&</span>
      {{ WELCOME.bride.en }}
    </p>
    <p class="mt-2 font-sans text-[11px] tracking-[0.16em] text-ink-muted">
      {{ WELCOME.date }}
    </p>
    <button
      type="button"
      class="mt-10 rounded-full bg-wine px-10 py-3.5 font-sans text-xs tracking-wide text-paper shadow-paper transition active:scale-[0.98]"
      @click="onOpen"
    >
      청첩장 열기
    </button>
    <p class="mt-4 font-myeongjo text-[11px] text-ink-faint">
      버튼을 누르면 배경음악이 함께 재생됩니다
    </p>
  </section>
</template>
