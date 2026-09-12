import { hashPassword } from '~/utils/hashPassword'
import { getSupabasePublicConfig } from '~/utils/supabasePublic'

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  created_at: string
}

const PAGE_SIZE = 5

export const useGuestbook = () => {
  const runtimeConfig = useRuntimeConfig()
  const supabase = useSupabaseClient()
  const entries = useState<GuestbookEntry[]>('guestbook-entries', () => [])
  const total = useState('guestbook-total', () => 0)
  const loading = useState('guestbook-loading', () => false)
  const loadingMore = useState('guestbook-loading-more', () => false)
  const submitting = useState('guestbook-submitting', () => false)
  const errorMessage = useState('guestbook-error', () => '')
  const configured = computed(() => getSupabasePublicConfig(runtimeConfig).configured)
  const hasMore = computed(() => entries.value.length < total.value)

  const selectRange = (from: number, to: number) => {
    return supabase
      .from('guestbook')
      .select('id, name, message, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
  }

  // 이미 펼쳐 둔 만큼은 유지한 채 목록을 처음부터 다시 채운다.
  const fetchEntries = async () => {
    if (!configured.value) {
      errorMessage.value = 'Supabase URL/Anon Key를 .env에 설정하면 방명록이 활성화됩니다.'
      return
    }
    loading.value = true
    errorMessage.value = ''

    const size = Math.max(entries.value.length, PAGE_SIZE)
    const { data, error, count } = await selectRange(0, size - 1)

    if (error) {
      errorMessage.value = '방명록을 불러오지 못했습니다.'
      console.error(error)
    }
    else {
      entries.value = (data ?? []) as GuestbookEntry[]
      total.value = count ?? entries.value.length
    }
    loading.value = false
  }

  const loadMore = async () => {
    if (!configured.value || loadingMore.value || !hasMore.value) return
    loadingMore.value = true
    errorMessage.value = ''

    const from = entries.value.length
    const { data, error, count } = await selectRange(from, from + PAGE_SIZE - 1)

    if (error) {
      errorMessage.value = '이전 메시지를 불러오지 못했습니다.'
      console.error(error)
    }
    else {
      entries.value = [...entries.value, ...((data ?? []) as GuestbookEntry[])]
      total.value = count ?? total.value
    }
    loadingMore.value = false
  }

  const createEntry = async (payload: { name: string; password: string; message: string }) => {
    if (!configured.value) return false
    submitting.value = true
    errorMessage.value = ''
    const password_hash = await hashPassword(payload.password)
    const { error } = await supabase.from('guestbook').insert({
      name: payload.name.trim(),
      message: payload.message.trim(),
      password_hash,
    })
    submitting.value = false
    if (error) {
      errorMessage.value = '메시지를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.'
      console.error(error)
      return false
    }
    await fetchEntries()
    return true
  }

  const deleteEntry = async (id: string, password: string) => {
    const { data, error } = await supabase.rpc('delete_guestbook_entry', {
      p_id: id,
      p_password: password,
    })

    if (error) {
      console.error(error)
      return false
    }
    if (!data) return false
    entries.value = entries.value.filter(item => item.id !== id)
    total.value = Math.max(total.value - 1, entries.value.length)
    return true
  }

  const subscribeRealtime = () => {
    if (!configured.value) return () => undefined
    const channel = supabase
      .channel('guestbook-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guestbook' },
        () => {
          void fetchEntries()
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }

  return {
    entries,
    total,
    loading,
    loadingMore,
    submitting,
    errorMessage,
    configured,
    hasMore,
    fetchEntries,
    loadMore,
    createEntry,
    deleteEntry,
    subscribeRealtime,
  }
}
