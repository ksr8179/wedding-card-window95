<script setup lang="ts">
interface FormState {
  name: string
  password: string
  message: string
}

const FORM_INIT: FormState = {
  name: '',
  password: '',
  message: '',
}

const form = reactive<FormState>({ ...FORM_INIT })
const deletingId = ref<string | null>(null)
const deletePassword = ref('')
const { showToast } = useToast()
const {
  entries,
  loading,
  submitting,
  errorMessage,
  fetchEntries,
  createEntry,
  deleteEntry,
  subscribeRealtime,
} = useGuestbook()

onMounted(async () => {
  await fetchEntries()
  const unsubscribe = subscribeRealtime()
  onBeforeUnmount(unsubscribe)
})

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const onSubmit = async () => {
  if (!form.name.trim() || !form.password.trim() || !form.message.trim()) {
    showToast('이름, 비밀번호, 메시지를 모두 입력해 주세요')
    return
  }
  if (form.password.length < 4) {
    showToast('비밀번호는 4자 이상이어야 합니다')
    return
  }

  const ok = await createEntry({
    name: form.name,
    password: form.password,
    message: form.message,
  })
  if (ok) {
    Object.assign(form, FORM_INIT)
    showToast('축하 메시지를 남겼습니다')
  }
}

const onDelete = async (id: string) => {
  if (!deletePassword.value) {
    showToast('비밀번호를 입력해 주세요')
    return
  }
  const ok = await deleteEntry(id, deletePassword.value)
  if (ok) {
    deletingId.value = null
    deletePassword.value = ''
    showToast('메시지가 삭제되었습니다')
    return
  }
  showToast('비밀번호가 일치하지 않습니다')
}
</script>

<template>
  <section class="px-6 py-12">
    <p class="text-center font-sans text-[10px] uppercase tracking-invitation text-ink-faint">Guestbook</p>
    <h2 class="mt-3 text-center font-myeongjo text-xl tracking-wide text-ink">방명록</h2>
    <p class="mt-3 text-center font-myeongjo text-sm leading-7 text-ink-muted">
      두 사람의 시작을 따뜻한 말로 남겨 주세요.
    </p>

    <form class="mt-8 space-y-3" @submit.prevent="onSubmit">
      <div class="grid grid-cols-2 gap-2">
        <input
          v-model="form.name"
          type="text"
          maxlength="20"
          placeholder="이름"
          class="w-full rounded-xl border border-wine/15 bg-paper-warm px-3 py-3 font-sans text-sm outline-none placeholder:text-ink-faint focus:border-wine/40"
        >
        <input
          v-model="form.password"
          type="password"
          maxlength="20"
          placeholder="비밀번호 (4자 이상)"
          class="w-full rounded-xl border border-wine/15 bg-paper-warm px-3 py-3 font-sans text-sm outline-none placeholder:text-ink-faint focus:border-wine/40"
        >
      </div>
      <textarea
        v-model="form.message"
        rows="4"
        maxlength="300"
        placeholder="축하 메시지를 남겨 주세요"
        class="w-full resize-none rounded-xl border border-wine/15 bg-paper-warm px-3 py-3 font-myeongjo text-sm leading-7 outline-none placeholder:font-sans placeholder:text-ink-faint focus:border-wine/40"
      />
      <p v-if="errorMessage" class="text-center font-sans text-xs text-wine">{{ errorMessage }}</p>
      <button
        type="submit"
        :disabled="submitting"
        class="w-full rounded-full bg-wine py-3 font-sans text-xs tracking-wide text-paper disabled:opacity-60"
      >
        {{ submitting ? '남기는 중...' : '메시지 남기기' }}
      </button>
    </form>

    <ul class="mt-8 space-y-3">
      <li v-if="loading" class="py-8 text-center font-sans text-xs text-ink-faint">불러오는 중...</li>
      <li v-else-if="!entries.length" class="py-8 text-center font-myeongjo text-sm text-ink-faint">
        첫 축하의 글을 남겨 주세요.
      </li>
      <li
        v-for="entry in entries"
        :key="entry.id"
        class="rounded-2xl border border-wine/10 bg-paper-warm p-4 shadow-paper"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-serif text-base text-ink">{{ entry.name }}</p>
            <p class="mt-0.5 font-sans text-[10px] text-ink-faint">{{ formatDate(entry.created_at) }}</p>
          </div>
          <button
            type="button"
            class="font-sans text-[10px] text-ink-faint"
            @click="deletingId = deletingId === entry.id ? null : entry.id"
          >
            삭제
          </button>
        </div>
        <p class="mt-3 whitespace-pre-wrap font-myeongjo text-sm leading-7 text-ink-muted">
          {{ entry.message }}
        </p>
        <div v-if="deletingId === entry.id" class="mt-3 flex gap-2">
          <input
            v-model="deletePassword"
            type="password"
            placeholder="작성 시 비밀번호"
            class="flex-1 rounded-lg border border-wine/15 bg-paper px-3 py-2 font-sans text-xs outline-none"
            @keyup.enter="onDelete(entry.id)"
          >
          <button
            type="button"
            class="rounded-lg bg-wine px-3 py-2 font-sans text-[10px] text-paper"
            @click="onDelete(entry.id)"
          >
            확인
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>
