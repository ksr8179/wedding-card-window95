<script setup lang="ts">
import { weddingConfig } from '~/config/wedding.config'

const GREETING = {
  title: weddingConfig.greeting.title,
  body: weddingConfig.greeting.body,
  groom: weddingConfig.couple.groom.ko,
  bride: weddingConfig.couple.bride.ko,
  date: weddingConfig.schedule.dateKo,
  time: weddingConfig.schedule.timeKo,
  venue: weddingConfig.schedule.venueKo,
}
</script>

<template>
  <section class="px-8 py-14 text-center">
    <p class="font-sans text-[10px] uppercase tracking-invitation text-ink-faint">Invitation</p>
    <h2 class="mt-4 font-myeongjo text-xl tracking-wide text-ink">
      {{ GREETING.title }}
    </h2>
    <div class="mx-auto mt-5 h-px w-10 bg-wine/30" />
    <p class="mt-8 whitespace-pre-line font-myeongjo text-[15px] leading-[2.05] text-ink-muted">
      {{ GREETING.body }}
    </p>

    <div class="mt-10 space-y-1.5 font-serif text-base text-ink">
      <p>
        <span class="text-ink-faint">신랑</span>
        <span class="mx-2 font-semibold">{{ GREETING.groom }}</span>
        <span class="font-script text-lg text-wine">♥</span>
        <span class="mx-2 font-semibold">{{ GREETING.bride }}</span>
        <span class="text-ink-faint">신부</span>
      </p>
      <p class="pt-3 font-sans text-xs tracking-wide text-ink-muted">
        {{ GREETING.date }} {{ GREETING.time }}
      </p>
      <p class="font-sans text-xs tracking-wide text-ink-muted">
        {{ GREETING.venue }}
      </p>
    </div>
  </section>
</template>
