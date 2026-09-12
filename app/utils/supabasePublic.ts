export const getSupabasePublicConfig = (config: { public: Record<string, unknown> }) => {
  const nested = config.public.supabase as { url?: string; key?: string } | undefined
  const url = String(nested?.url || config.public.supabaseUrl || '').trim()
  const key = String(nested?.key || config.public.supabaseKey || '').trim()
  const configured = Boolean(url) && Boolean(key) && !url.includes('placeholder.supabase.co') && key !== 'public-anon-key'

  return { url, key, configured }
}
