type SupabaseNested = {
  url?: string
  key?: string
}

const firstValue = (...values: Array<string | undefined>) => {
  for (const value of values) {
    const trimmed = value?.trim()
    if (trimmed) return trimmed
  }
  return ''
}

export const getSupabasePublicConfig = (config: { public: Record<string, unknown> }) => {
  const nested = config.public.supabase as SupabaseNested | undefined
  const url = firstValue(
    nested?.url,
    config.public.supabaseUrl as string | undefined,
    import.meta.server ? process.env.NUXT_PUBLIC_SUPABASE_URL : undefined,
    import.meta.server ? process.env.SUPABASE_URL : undefined,
  )
  const key = firstValue(
    nested?.key,
    config.public.supabaseKey as string | undefined,
    import.meta.server ? process.env.NUXT_PUBLIC_SUPABASE_KEY : undefined,
    import.meta.server ? process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY : undefined,
    import.meta.server ? process.env.SUPABASE_KEY : undefined,
    import.meta.server ? process.env.SUPABASE_ANON_KEY : undefined,
    import.meta.server ? process.env.SUPABASE_PUBLISHABLE_KEY : undefined,
    import.meta.server ? process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY : undefined,
  )
  const configured = Boolean(url) && Boolean(key) && !url.includes('placeholder.supabase.co') && key !== 'public-anon-key'

  return { url, key, configured }
}
