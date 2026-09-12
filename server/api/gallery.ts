import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const { data, error } = await client
      .from('gallery')
      .select('id, url')
      .is('gubun', null)
      .order('id', { ascending: true })

    if (error) {
      console.error(error)
      return []
    }

    return data ?? []
  } catch (error) {
    console.error(error)
    return []
  }
})
