// server/api/gallery.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // 1. 여기서 터지는지 확인
    const client = await serverSupabaseClient(event)
    const { gubun } = getQuery(event)
    
    let dbQuery = client.from('gallery').select('*')

    if(gubun) {
      dbQuery = dbQuery.eq("gubun", gubun)
    }else {
      // gubun이 없거나 빈 문자열일 경우에 대한 명확한 처리
      dbQuery = dbQuery.is('gubun', null); // 혹은 필요한 기본 조건
    }

    dbQuery = dbQuery.order('id', { ascending: true }) // 정렬

    // 2. 여기서 터지는지 확인
    const { data, error } = await dbQuery
    
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
