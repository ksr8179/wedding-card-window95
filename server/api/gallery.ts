import type { SupabaseClient } from '@supabase/supabase-js'
import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { H3Event } from 'h3'

type GalleryRow = {
  id: number
  url: string | null
  gubun?: string | null
}

const readParam = (value: unknown) => {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === undefined || raw === null) return ''
  return String(raw).trim()
}

// service_role은 RLS를 우회한다. 없으면 anon 클라이언트로 떨어진다.
const resolveClient = async (event: H3Event) => {
  const serviceRoleKey = String(useRuntimeConfig(event).supabaseServiceRoleKey || '').trim()
  if (serviceRoleKey) {
    try {
      return {
        client: serverSupabaseServiceRole(event) as unknown as SupabaseClient,
        role: 'service_role' as const,
      }
    }
    catch (error) {
      console.error('serverSupabaseServiceRole 실패', error)
    }
  }

  return {
    client: (await serverSupabaseClient(event)) as unknown as SupabaseClient,
    role: 'anon' as const,
  }
}

export default defineEventHandler(async (event) => {
  const { client, role } = await resolveClient(event)
  const gubun = readParam(getQuery(event).gubun)
  const wantsNull = gubun.length === 0 || gubun.toLowerCase() === 'null'

  let dbQuery = client.from('gallery').select('id, url, gubun').order('id', { ascending: true })
  dbQuery = wantsNull ? dbQuery.is('gubun', null) : dbQuery.eq('gubun', gubun)

  const { data, error } = await dbQuery
  if (error) {
    throw createError({
      statusCode: 502,
      statusMessage: `gallery 조회 실패 (${role}): ${error.message}`,
    })
  }

  return ((data ?? []) as GalleryRow[])
    .filter((row): row is GalleryRow & { url: string } => typeof row.url === 'string' && row.url.length > 0)
    .map(row => ({ id: row.id, url: row.url }))
})
