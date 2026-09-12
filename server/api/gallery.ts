import { serverSupabaseClient } from '#supabase/server'

type GalleryRow = {
  id: number
  url: string | null
  gubun?: string | null
}

const isEmptyGubun = (value: unknown) => {
  if (value == null) return true
  const gubun = String(value).trim().toLowerCase()
  return gubun.length === 0 || gubun === 'null'
}

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from('gallery')
    .select('id, url, gubun')
    .order('id', { ascending: true })

  if (error) {
    throw createError({
      statusCode: 502,
      statusMessage: error.message,
    })
  }

  return (data ?? [])
    .filter((row): row is GalleryRow & { url: string } => isEmptyGubun(row.gubun) && typeof row.url === 'string' && row.url.length > 0)
    .map(row => ({ id: row.id, url: row.url }))
})
