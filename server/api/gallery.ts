// server/api/gallery.ts
import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const { gubun } = getQuery(event)

    let dbQuery = client.from('gallery').select('*').order('id', { ascending: true })

    if (typeof gubun === 'string' && gubun.length > 0) {
      dbQuery = dbQuery.eq('gubun', gubun)
    }

    const { data, error } = await dbQuery
    
    if (error) {
      return { source: 'Supabase DB Error', details: error }
    }
    
    return data
  } catch (err: any) {
    return { 
      source: 'Server Crash Catch', 
      message: err.message, 
      stack: err.stack 
    }
  }
})
