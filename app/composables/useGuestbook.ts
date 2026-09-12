import { hashPassword } from '~/utils/hashPassword'

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  created_at: string
}

const isConfiguredSupabase = (url?: string, key?: string) => {
  if (!url || !key) return false
  return !url.includes('placeholder.supabase.co') && key !== 'public-anon-key'
}

export const useGuestbook = () => {
  const runtimeConfig = useRuntimeConfig()
  const supabase = useSupabaseClient()
  const entries = useState<GuestbookEntry[]>('guestbook-entries', () => [])
  const loading = useState('guestbook-loading', () => false)
  const submitting = useState('guestbook-submitting', () => false)
  const errorMessage = useState('guestbook-error', () => '')
  const configured = computed(() =>
    isConfiguredSupabase(
      String(runtimeConfig.public.supabaseUrl || ''),
      String(runtimeConfig.public.supabaseKey || ''),
    ),
  )

  const fetchEntries = async () => {
    if (!configured.value) {
      errorMessage.value = 'Supabase URL/Anon Key를 .env에 설정하면 방명록이 활성화됩니다.'
      return
    }
    loading.value = true
    errorMessage.value = ''
    const { data, error } = await supabase
      .from('guestbook')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      errorMessage.value = '방명록을 불러오지 못했습니다.'
      console.error(error)
    } else {
      entries.value = (data ?? []) as GuestbookEntry[]
    }
    loading.value = false
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
    loading,
    submitting,
    errorMessage,
    configured,
    fetchEntries,
    createEntry,
    deleteEntry,
    subscribeRealtime,
  }
}
