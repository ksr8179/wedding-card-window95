import { serverSupabaseClient } from '#supabase/server'

const readGubun = (value: unknown) => {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === undefined || raw === null) return null
  const gubun = String(raw).trim()
  if (gubun.length === 0 || gubun === 'null') return null
  return gubun
}

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const gubun = readGubun(getQuery(event).gubun)

    let dbQuery = client.from('gallery').select('id, url').order('id', { ascending: true })
    dbQuery = gubun === null ? dbQuery.is('gubun', null) : dbQuery.eq('gubun', gubun)

    const { data, error } = await dbQuery

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
