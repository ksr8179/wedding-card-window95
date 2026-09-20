<script setup lang="ts">
import { weddingConfig } from '~/config/wedding.config'

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
const file = ref<File | null>(null)
const previewUrl = ref('')
const selectedId = ref<string | null>(null)
const deleting = ref(false)
const deletingBusy = ref(false)
const deletePassword = ref('')
const deleteError = ref('')
const cameraInput = ref<HTMLInputElement | null>(null)
const albumInput = ref<HTMLInputElement | null>(null)
const { showToast } = useToast()
const {
  photos,
  total,
  loading,
  loadingMore,
  submitting,
  uploadStatus,
  errorMessage,
  hasMore,
  publicUrl,
  validateFile,
  fetchPhotos,
  loadMore,
  uploadPhoto,
  deletePhoto,
  subscribeRealtime,
} = useLivePhotos()

const nowTick = ref(Date.now())
const isUploadOpen = computed(() => {
  nowTick.value
  return isLivePhotoUploadOpen()
})

onMounted(async () => {
  const timer = setInterval(() => {
    nowTick.value = Date.now()
  }, 30_000)
  await fetchPhotos()
  const unsubscribe = subscribeRealtime()
  onBeforeUnmount(() => {
    clearInterval(timer)
    unsubscribe()
  })
})

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const statusLabel = computed(() => {
  if (uploadStatus.value === 'compressing') return '사진 줄이는 중...'
  if (uploadStatus.value === 'uploading') return '올리는 중...'
  if (uploadStatus.value === 'saving') return '저장하는 중...'
  return '사진 올리기'
})

const clearPreview = () => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  file.value = null
  if (cameraInput.value) cameraInput.value.value = ''
  if (albumInput.value) albumInput.value.value = ''
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const next = input.files?.[0]
  if (!next) return

  const invalid = validateFile(next)
  if (invalid) {
    showToast(invalid)
    input.value = ''
    return
  }

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  file.value = next
  previewUrl.value = URL.createObjectURL(next)
}

const onSubmit = async () => {
  if (!isUploadOpen.value) {
    showToast('예식 당일부터 사진을 올릴 수 있습니다')
    return
  }
  if (!form.name.trim()) {
    showToast('이름을 입력해 주세요')
    return
  }
  if (!file.value) {
    showToast('사진을 선택해 주세요')
    return
  }
  if (form.password.trim().length < 4) {
    showToast('비밀번호는 4자 이상이어야 합니다')
    return
  }

  const ok = await uploadPhoto({
    name: form.name,
    message: form.message,
    password: form.password,
    file: file.value,
  })
  if (!ok) return

  Object.assign(form, FORM_INIT)
  clearPreview()
  showToast('현장 사진을 올렸습니다')
}

const selectedPhoto = computed(() => {
  if (!selectedId.value) return null
  return photos.value.find(item => item.id === selectedId.value) ?? null
})

const closeSelected = () => {
  selectedId.value = null
  deleting.value = false
  deletingBusy.value = false
  deletePassword.value = ''
  deleteError.value = ''
}

const onDelete = async () => {
  if (!selectedId.value || deletingBusy.value) return
  if (!deletePassword.value.trim()) {
    deleteError.value = '비밀번호를 입력해 주세요'
    return
  }
  deletingBusy.value = true
  deleteError.value = ''
  const ok = await deletePhoto(selectedId.value, deletePassword.value)
  deletingBusy.value = false
  if (ok) {
    closeSelected()
    showToast('사진을 삭제했습니다')
    return
  }
  deleteError.value = errorMessage.value || '비밀번호가 일치하지 않습니다'
}
</script>

<template>
  <section class="px-6 py-12">
    <p class="text-center font-sans text-[10px] uppercase tracking-invitation text-ink-faint">Live Photos</p>
    <h2 class="mt-3 text-center font-myeongjo text-xl tracking-wide text-ink">현장 사진</h2>
    <p class="mt-3 text-center font-myeongjo text-sm leading-7 text-ink-muted">
      <template v-if="isUploadOpen">
        오늘의 순간을 함께 남겨 주세요.<br>잘못 올린 사진은 비밀번호로 지울 수 있습니다.
      </template>
      <template v-else>
        예식 당일({{ weddingConfig.schedule.dateKo }})부터<br>현장 사진을 남길 수 있습니다.
      </template>
    </p>

    <form v-if="isUploadOpen" class="mt-8 space-y-3" @submit.prevent="onSubmit">
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
        rows="2"
        maxlength="100"
        placeholder="한 줄 메시지 (선택)"
        class="w-full resize-none rounded-xl border border-wine/15 bg-paper-warm px-3 py-3 font-myeongjo text-sm leading-7 outline-none placeholder:font-sans placeholder:text-ink-faint focus:border-wine/40"
      />

      <input
        ref="cameraInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        class="hidden"
        @change="onFileChange"
      >
      <input
        ref="albumInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        class="hidden"
        @change="onFileChange"
      >

      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          class="rounded-full border border-wine/20 py-3 font-sans text-[11px] tracking-wide text-wine"
          :disabled="submitting"
          @click="cameraInput?.click()"
        >
          카메라
        </button>
        <button
          type="button"
          class="rounded-full border border-wine/20 py-3 font-sans text-[11px] tracking-wide text-wine"
          :disabled="submitting"
          @click="albumInput?.click()"
        >
          앨범
        </button>
      </div>

      <div v-if="previewUrl" class="relative overflow-hidden rounded-xl bg-sky-photo">
        <img :src="previewUrl" alt="선택한 현장 사진" class="max-h-48 w-full object-cover">
        <button
          type="button"
          class="absolute right-2 top-2 rounded-full bg-wine/80 px-2.5 py-1 font-sans text-[10px] text-paper"
          @click="clearPreview"
        >
          삭제
        </button>
      </div>

      <p v-if="errorMessage" class="text-center font-sans text-xs text-wine">{{ errorMessage }}</p>
      <button
        type="submit"
        :disabled="submitting"
        class="flex w-full items-center justify-center gap-2 rounded-full bg-wine py-3 font-sans text-xs tracking-wide text-paper disabled:opacity-60"
      >
        <span
          v-if="submitting"
          class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-paper/30 border-t-paper"
          aria-hidden="true"
        />
        {{ statusLabel }}
      </button>
    </form>

    <p v-if="total" class="mt-8 text-center font-sans text-[10px] tracking-invitation text-ink-faint">
      총 {{ total }}장의 사진
    </p>

    <div class="mt-3 grid grid-cols-2 gap-2">
      <p v-if="loading && !photos.length" class="col-span-2 py-8 text-center font-sans text-xs text-ink-faint">
        불러오는 중...
      </p>
      <p v-else-if="!photos.length" class="col-span-2 py-8 text-center font-myeongjo text-sm text-ink-faint">
        첫 현장 사진을 남겨 주세요.
      </p>
      <button
        v-for="photo in photos"
        :key="photo.id"
        type="button"
        class="group relative aspect-square overflow-hidden rounded-xl bg-sky-photo shadow-paper"
        @click="selectedId = photo.id; deleting = false; deletePassword = ''; deleteError = ''"
      >
        <img
          :src="publicUrl(photo.storage_path)"
          :alt="photo.name"
          class="h-full w-full object-cover"
        >
        <span class="absolute inset-x-0 bottom-0 bg-wine-deep/55 px-2 py-1.5 text-left font-sans text-[10px] text-paper">
          {{ photo.name }}
        </span>
      </button>
    </div>

    <button
      v-if="hasMore"
      type="button"
      :disabled="loadingMore"
      class="mt-4 w-full rounded-full border border-wine/20 py-3 font-sans text-[11px] tracking-wide text-wine transition active:scale-[0.99] disabled:opacity-60"
      @click="loadMore"
    >
      {{ loadingMore ? '불러오는 중...' : `이전 사진 더 보기 (${total - photos.length})` }}
    </button>

    <Teleport to="body">
      <div
        v-if="selectedPhoto"
        class="fixed inset-0 z-[90] flex items-center justify-center bg-wine-deep/80 p-4 backdrop-blur-sm"
        @click="closeSelected"
      >
        <div class="relative w-full max-w-md overflow-hidden rounded-2xl bg-paper-lace p-3 shadow-phone" @click.stop>
          <div class="flex items-start justify-between gap-3 px-1 pb-2">
            <div>
              <p class="font-serif text-base text-ink">{{ selectedPhoto.name }}</p>
              <p class="mt-0.5 font-sans text-[10px] text-ink-faint">{{ formatDate(selectedPhoto.created_at) }}</p>
            </div>
            <button
              type="button"
              class="rounded-full bg-wine px-3 py-1 font-sans text-[11px] text-paper"
              @click="closeSelected"
            >
              닫기
            </button>
          </div>
          <img
            :src="publicUrl(selectedPhoto.storage_path)"
            :alt="selectedPhoto.name"
            class="max-h-[70vh] w-full rounded-xl object-contain"
          >
          <p v-if="selectedPhoto.message" class="mt-3 font-myeongjo text-sm leading-7 text-ink-muted">
            {{ selectedPhoto.message }}
          </p>
          <button
            type="button"
            class="mt-3 w-full font-sans text-[10px] text-ink-faint"
            @click="deleting = !deleting"
          >
            삭제
          </button>
          <div v-if="deleting" class="mt-2 space-y-2">
            <div class="flex gap-2">
              <input
                v-model="deletePassword"
                type="password"
                placeholder="올릴 때 비밀번호"
                class="flex-1 rounded-lg border border-wine/15 bg-paper px-3 py-2 font-sans text-xs outline-none"
                @keyup.enter="onDelete"
              >
              <button
                type="button"
                class="rounded-lg bg-wine px-3 py-2 font-sans text-[10px] text-paper disabled:opacity-60"
                :disabled="deletingBusy"
                @click="onDelete"
              >
                {{ deletingBusy ? '삭제 중' : '확인' }}
              </button>
            </div>
            <p v-if="deleteError" class="text-center font-sans text-[10px] text-wine">
              {{ deleteError }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
