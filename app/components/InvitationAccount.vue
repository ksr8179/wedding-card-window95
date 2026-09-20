<script setup lang="ts">
import { weddingConfig, type AccountPerson } from '~/config/wedding.config'

type SideKey = 'groomSide' | 'brideSide'

const ACCOUNT = weddingConfig.accounts
const { showToast } = useToast()
const accountNumbers = useRuntimeConfig().public.accountNumbers as Record<string, string | undefined>

const activeSide = ref<SideKey>('groomSide')
const open = ref(true)

const people = computed(() => ACCOUNT[activeSide.value].people)

const numberOf = (person: AccountPerson) => accountNumbers?.[person.key]?.trim() ?? ''

const selectSide = (side: SideKey) => {
  activeSide.value = side
  open.value = true
}

const copyAccount = async (person: AccountPerson) => {
  const number = numberOf(person)
  if (!number) return

  const text = `${number} ${person.bank}`
  try {
    await navigator.clipboard.writeText(text)
    showToast('계좌번호가 복사되었습니다')
  } catch {
    window.alert(text)
  }
}
</script>

<template>
  <section class="px-6 py-12">
    <p class="text-center font-sans text-[10px] uppercase tracking-invitation text-ink-faint">Gift</p>
    <h2 class="mt-3 text-center font-myeongjo text-xl tracking-wide text-ink">마음 전하실 곳</h2>
    <p class="mt-3 text-center font-myeongjo text-sm leading-7 text-ink-muted">
      참석이 어려우신 분들을 위해<br>계좌번호를 안내드립니다.
    </p>

    <div class="mt-8 grid grid-cols-2 gap-2 rounded-full bg-wine/5 p-1">
      <button
        type="button"
        class="rounded-full py-2.5 font-sans text-xs tracking-wide transition"
        :class="activeSide === 'groomSide' ? 'bg-wine text-paper shadow-sm' : 'text-ink-muted'"
        @click="selectSide('groomSide')"
      >
        신랑측
      </button>
      <button
        type="button"
        class="rounded-full py-2.5 font-sans text-xs tracking-wide transition"
        :class="activeSide === 'brideSide' ? 'bg-wine text-paper shadow-sm' : 'text-ink-muted'"
        @click="selectSide('brideSide')"
      >
        신부측
      </button>
    </div>

    <button
      type="button"
      class="mt-4 flex w-full items-center justify-between border-b border-wine/15 py-3 font-serif text-base text-ink"
      @click="open = !open"
    >
      <span>{{ ACCOUNT[activeSide].label }} 계좌 안내</span>
      <span class="text-xs text-ink-faint transition" :class="open ? 'rotate-180' : ''">▾</span>
    </button>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ul v-show="open" class="space-y-3 pt-4">
        <li
          v-for="person in people"
          :key="`${person.relation}-${person.name}`"
          class="rounded-xl bg-paper-warm p-4 shadow-paper"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-sans text-[10px] uppercase tracking-wider text-wine">{{ person.relation }}</p>
              <p class="mt-1 font-serif text-lg text-ink">{{ person.name }}</p>
              <p class="mt-1 font-sans text-xs text-ink-muted">
                <template v-if="numberOf(person)">{{ person.bank }} · {{ numberOf(person) }}</template>
                <template v-else>계좌번호 준비 중입니다</template>
              </p>
            </div>
            <button
              v-if="numberOf(person)"
              type="button"
              class="shrink-0 rounded-full border border-wine/20 px-3 py-1.5 font-sans text-[11px] text-wine"
              @click="copyAccount(person)"
            >
              복사
            </button>
          </div>
          <a
            v-if="'kakaoPayUrl' in person && person.kakaoPayUrl"
            :href="person.kakaoPayUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#FEE500] py-2 font-sans text-[11px] font-medium text-ink"
          >
            카카오페이 송금
          </a>
        </li>
      </ul>
    </Transition>
  </section>
</template>
