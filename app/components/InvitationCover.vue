<script setup lang="ts">
import { weddingConfig } from '~/config/wedding.config'

const COVER = {
  title: weddingConfig.couple.title,
  kicker: weddingConfig.couple.kicker,
  footer: weddingConfig.couple.footer,
  groom: weddingConfig.couple.groom,
  bride: weddingConfig.couple.bride,
  schedule: weddingConfig.schedule,
  photos: weddingConfig.photos,
}
</script>

<template>
  <section class="relative overflow-hidden px-5 pb-10 pt-8 text-center">
    <p class="font-script text-[2.35rem] leading-[1.15] text-ink sm:text-[2.7rem]">
      {{ COVER.title }}
    </p>

    <p class="mt-8 whitespace-pre-line font-sans text-[10px] font-medium uppercase tracking-invitation text-ink">
      {{ COVER.kicker }}
    </p>

    <div class="relative mx-auto mt-6 min-h-[220px] max-w-[280px]">
      <div class="absolute left-0 top-10 h-[92px] w-[92px] overflow-hidden bg-sky-photo shadow-sm">
        <img
          :src="COVER.photos.left"
          :alt="`${COVER.groom.ko}와 ${COVER.bride.ko}`"
          class="h-full w-full scale-[4.4] object-cover"
        >
      </div>

      <div class="absolute right-0 top-0 h-[148px] w-[148px] overflow-hidden bg-sky-photo shadow-md">
        <img
          :src="COVER.photos.right"
          :alt="`${COVER.groom.en} and ${COVER.bride.en}`"
          class="h-full w-full scale-[2.7] object-cover"
        >
      </div>

      <p class="absolute left-0 top-[138px] text-left font-script text-[1.85rem] leading-none text-ink">
        {{ COVER.groom.en }}
      </p>
      <p class="absolute bottom-2 left-[4.5rem] font-script text-lg italic text-ink">
        and
      </p>
      <p class="absolute bottom-0 right-1 font-script text-[1.85rem] leading-none text-ink">
        {{ COVER.bride.en }}
      </p>
    </div>

    <div class="mt-8 space-y-1 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-ink">
      <p>{{ COVER.schedule.weekdayEn }}</p>
      <p>{{ COVER.schedule.dateEn }}</p>
      <p>{{ COVER.schedule.timeEn }}</p>
      <p class="pt-1">{{ COVER.schedule.venueEn }}</p>
    </div>

    <p class="mt-8 whitespace-pre-line font-sans text-[10px] font-medium uppercase tracking-invitation text-ink">
      {{ COVER.footer }}
    </p>
  </section>
</template>
