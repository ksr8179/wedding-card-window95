import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const gubun = getQuery(event).gubun
  const gubunValue = Array.isArray(gubun) ? gubun[0] : gubun

  let dbQuery = client.from('gallery').select('id, url').order('id', { ascending: true })

  if (typeof gubunValue === 'string' && gubunValue.length > 0 && gubunValue !== 'null') {
    dbQuery = dbQuery.eq('gubun', gubunValue)
  } else {
    dbQuery = dbQuery.is('gubun', null)
  }

  const { data, error } = await dbQuery
  if (error) {
    throw createError({
      statusCode: 502,
      statusMessage: error.message,
    })
  }

  return data ?? []
})
