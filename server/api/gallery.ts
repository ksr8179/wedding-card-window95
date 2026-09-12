import { getSupabasePublicConfig } from '~/utils/supabasePublic'

type GalleryRow = {
  id: number
  url: string
  gubun?: string | null
}

const readGubun = (value: unknown) => {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === undefined || raw === null) return null
  const gubun = String(raw).trim()
  if (gubun.length === 0 || gubun === 'null') return null
  return gubun
}

const matchesGubun = (row: GalleryRow, gubun: string | null) => {
  const value = row.gubun == null ? '' : String(row.gubun).trim()
  if (gubun === null) return value.length === 0
  return value === gubun
}

export default defineEventHandler(async (event) => {
  const { url, key } = getSupabasePublicConfig(useRuntimeConfig(event))
  if (!url || !key) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase URL/Key가 설정되지 않았습니다.',
    })
  }

  const gubun = readGubun(getQuery(event).gubun)

  const rows = await $fetch<GalleryRow[]>(`${url}/rest/v1/gallery`, {
    query: {
      select: 'id,url,gubun',
      order: 'id.asc',
    },
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  return (Array.isArray(rows) ? rows : [])
    .filter(row => typeof row?.url === 'string' && row.url.length > 0 && matchesGubun(row, gubun))
    .map(row => ({ id: row.id, url: row.url }))
})
