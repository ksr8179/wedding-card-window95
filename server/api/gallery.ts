import { getSupabasePublicConfig } from '~/utils/supabasePublic'

const readGubun = (value: unknown) => {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === undefined || raw === null) return null
  const gubun = String(raw).trim()
  if (gubun.length === 0 || gubun === 'null') return null
  return gubun
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
  const query: Record<string, string> = {
    select: 'id,url',
    order: 'id.asc',
  }

  if (gubun === null) {
    query.or = '(gubun.is.null,gubun.eq."")'
  } else {
    query.gubun = `eq.${gubun}`
  }

  try {
    const data = await $fetch<Array<{ id: number; url: string }>>(`${url}/rest/v1/gallery`, {
      query,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    })

    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error(error)
    throw createError({
      statusCode: 502,
      statusMessage: '갤러리를 불러오지 못했습니다.',
    })
  }
})
