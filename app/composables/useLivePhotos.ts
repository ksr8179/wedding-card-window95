import { hashPassword } from '~/utils/hashPassword'
import { weddingConfig } from '~/config/wedding.config'
import { getSupabasePublicConfig } from '~/utils/supabasePublic'

export interface LivePhoto {
  id: string
  name: string
  message: string
  storage_path: string
  created_at: string
}

export type LivePhotoUploadStatus = 'idle' | 'compressing' | 'uploading' | 'saving'

const PAGE_SIZE = 6
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const

const CONFIG = weddingConfig.livePhotos
const MAX_BYTES = CONFIG.maxOriginalMb * 1024 * 1024
const OPENS_ON = CONFIG.opensOn
const CLOSES_ON = CONFIG.closesOn

const seoulCalendarDate = (at = new Date()) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(at)
}

export const isLivePhotoUploadOpen = (at = new Date()) => {
  const today = seoulCalendarDate(at)
  if (today < OPENS_ON) return false
  if (CLOSES_ON && today > CLOSES_ON) return false
  return true
}

const extensionOf = (file: File) => {
  const fromName = file.name.split('.').pop()?.trim().toLowerCase() ?? ''
  if (fromName) return fromName
  if (file.type === 'image/jpeg') return 'jpg'
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  return ''
}

export const useLivePhotos = () => {
  const runtimeConfig = useRuntimeConfig()
  const supabase = useSupabaseClient()
  const { url: supabaseUrl, configured } = getSupabasePublicConfig(runtimeConfig)

  const photos = useState<LivePhoto[]>('live-photos', () => [])
  const total = useState('live-photos-total', () => 0)
  const loading = useState('live-photos-loading', () => false)
  const loadingMore = useState('live-photos-loading-more', () => false)
  const submitting = useState('live-photos-submitting', () => false)
  const uploadStatus = useState<LivePhotoUploadStatus>('live-photos-status', () => 'idle')
  const errorMessage = useState('live-photos-error', () => '')
  const hasMore = computed(() => photos.value.length < total.value)

  const publicUrl = (storagePath: string) => {
    if (!supabaseUrl || !storagePath) return ''
    const { data } = supabase.storage.from(CONFIG.bucket).getPublicUrl(storagePath)
    return data.publicUrl
  }

  const selectRange = (from: number, to: number) => {
    return supabase
      .from('live_photos')
      .select('id, name, message, storage_path, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
  }

  const fetchPhotos = async () => {
    if (!configured) {
      errorMessage.value = 'Supabase URL/Anon Key를 .env에 설정하면 현장 사진이 활성화됩니다.'
      return
    }
    loading.value = true
    errorMessage.value = ''

    const size = Math.max(photos.value.length, PAGE_SIZE)
    const { data, error, count } = await selectRange(0, size - 1)

    if (error) {
      errorMessage.value = '현장 사진을 불러오지 못했습니다.'
      console.error(error)
    }
    else {
      photos.value = (data ?? []) as LivePhoto[]
      total.value = count ?? photos.value.length
    }
    loading.value = false
  }

  const loadMore = async () => {
    if (!configured || loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    errorMessage.value = ''

    const from = photos.value.length
    const { data, error, count } = await selectRange(from, from + PAGE_SIZE - 1)

    if (error) {
      errorMessage.value = '이전 사진을 불러오지 못했습니다.'
      console.error(error)
    }
    else {
      photos.value = [...photos.value, ...((data ?? []) as LivePhoto[])]
      total.value = count ?? total.value
    }
    loadingMore.value = false
  }

  const validateFile = (file: File) => {
    const extension = extensionOf(file)
    const typeOk = ALLOWED_TYPES.includes(file.type as typeof ALLOWED_TYPES[number])
    const extOk = ALLOWED_EXTENSIONS.includes(extension as typeof ALLOWED_EXTENSIONS[number])

    if (!typeOk && !extOk) {
      return 'jpg, png, webp 이미지만 올릴 수 있습니다.'
    }
    if (file.size > MAX_BYTES) {
      return `원본 사진은 ${CONFIG.maxOriginalMb}MB 이하여야 합니다.`
    }
    return ''
  }

  const compressFile = async (file: File) => {
    const { default: imageCompression } = await import('browser-image-compression')
    return imageCompression(file, {
      maxWidthOrHeight: CONFIG.maxWidthOrHeight,
      initialQuality: CONFIG.quality,
      maxSizeMB: 1,
      useWebWorker: true,
      fileType: 'image/jpeg',
    })
  }

  const uploadPhoto = async (payload: { name: string; message: string; password: string; file: File }) => {
    if (!configured) return false
    if (!isLivePhotoUploadOpen()) {
      errorMessage.value = '예식 당일부터 사진을 올릴 수 있습니다.'
      return false
    }
    if (payload.password.trim().length < 4) {
      errorMessage.value = '비밀번호는 4자 이상이어야 합니다.'
      return false
    }
    const invalid = validateFile(payload.file)
    if (invalid) {
      errorMessage.value = invalid
      return false
    }

    submitting.value = true
    errorMessage.value = ''
    let storagePath = ''

    try {
      uploadStatus.value = 'compressing'
      const compressed = await compressFile(payload.file)
      storagePath = `${crypto.randomUUID()}.jpg`

      uploadStatus.value = 'uploading'
      const { error: uploadError } = await supabase.storage
        .from(CONFIG.bucket)
        .upload(storagePath, compressed, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      uploadStatus.value = 'saving'
      const password_hash = await hashPassword(payload.password)
      const { error: insertError } = await supabase.from('live_photos').insert({
        name: payload.name.trim(),
        message: payload.message.trim(),
        storage_path: storagePath,
        password_hash,
      })

      if (insertError) {
        await supabase.storage.from(CONFIG.bucket).remove([storagePath])
        throw insertError
      }

      await fetchPhotos()
      return true
    }
    catch (error) {
      console.error(error)
      errorMessage.value = '사진을 올리지 못했습니다. 잠시 후 다시 시도해 주세요.'
      return false
    }
    finally {
      submitting.value = false
      uploadStatus.value = 'idle'
    }
  }

  const deletePhoto = async (id: string, password: string) => {
    const { data, error } = await supabase.rpc('delete_live_photo', {
      p_id: id,
      p_password: password,
    })

    if (error) {
      console.error(error)
      return false
    }
    if (!data) return false
    photos.value = photos.value.filter(item => item.id !== id)
    total.value = Math.max(total.value - 1, photos.value.length)
    return true
  }

  const subscribeRealtime = () => {
    if (!configured) return () => undefined
    const channel = supabase
      .channel('live-photos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'live_photos' },
        () => {
          void fetchPhotos()
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }

  return {
    photos,
    total,
    loading,
    loadingMore,
    submitting,
    uploadStatus,
    errorMessage,
    configured,
    hasMore,
    publicUrl,
    validateFile,
    fetchPhotos,
    loadMore,
    uploadPhoto,
    deletePhoto,
    subscribeRealtime,
  }
}
