// server/api/gallery.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // 1. 여기서 터지는지 확인
    const client = await serverSupabaseClient(event)
    
    // 2. 여기서 터지는지 확인
    const { data, error } = await client.from('gallery').select('*')
    
    if (error) {
      return { source: 'Supabase DB Error', details: error }
    }
    
    return { source: 'Success', data }
  } catch (err: any) {
    // 에러가 나면 숨기지 말고 브라우저에 에러 메시지를 JSON으로 뱉어내라!
    return { 
      source: 'Server Crash Catch', 
      message: err.message, 
      stack: err.stack 
    }
  }
})
