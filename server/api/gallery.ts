import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from('gallery')
    .select('id, url')
    .is('gubun', null)
    .order('id', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 502,
      statusMessage: error.message,
    })
  }

  return data ?? []
})
