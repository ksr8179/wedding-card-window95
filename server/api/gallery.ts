import { getSupabasePublicConfig } from '~/utils/supabasePublic'

type GalleryRow = {
  id: number
  url: string | null
  gubun?: string | null
}

const parseGubunParam = (value: unknown) => {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === undefined || raw === null) return null
  const gubun = String(raw).trim()
  if (gubun.length === 0 || gubun.toLowerCase() === 'null') return null
  return gubun
}

const isEmptyGubun = (value: unknown) => {
  if (value == null) return true
  const gubun = String(value).trim().toLowerCase()
  return gubun.length === 0 || gubun === 'null'
}

export default defineEventHandler(async (event) => {
  const { url, key } = getSupabasePublicConfig(useRuntimeConfig(event))
  if (!url || !key) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase URL/Key가 설정되지 않았습니다.',
    })
  }

  const gubun = parseGubunParam(getQuery(event).gubun)
  const rows = await $fetch<GalleryRow[]>(`${url.replace(/\/$/, '')}/rest/v1/gallery`, {
    query: {
      select: 'id,url,gubun',
      order: 'id.asc',
    },
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  })

  const list = Array.isArray(rows) ? rows : []

  return list
    .filter((row) => {
      if (typeof row.url !== 'string' || row.url.length === 0) return false
      return gubun === null ? isEmptyGubun(row.gubun) : String(row.gubun ?? '').trim() === gubun
    })
    .map(row => ({ id: row.id, url: row.url }))
})
