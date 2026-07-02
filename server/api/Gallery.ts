import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  //const user = await serverSupabaseUser(event) //로그인이 필요할 경우
  const client = await serverSupabaseClient(event)
  const method = event.method

  // 1. 보호된 API(로그인이 필요할 경우)
  // if (!user) {
  //   throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  // }

  // 2. 메서드에 따른 분기 처리
  switch (method) {
    case 'GET':
      const { gubun } = getQuery(event);

      let dbQuery = client
        .from('gallery')
        .select('*')

      if(gubun !== '') {
        dbQuery = dbQuery.eq('gubun', gubun)
      }else {
        dbQuery = dbQuery.eq('gubun', '')
      }

      dbQuery = dbQuery.order('id', { ascending: true }) // 정렬

      const { data: photos, error: getErr } = await dbQuery

      if (getErr) throw createError({ statusCode: 500, statusMessage: getErr.message })

      return photos

    // case 'POST':
    //   const body = await readBody(event)
    //   const { data: postData, error: postErr } = await client
    //     .from('todos')
    //     .insert({ ...body, user_id: user.id })
    //   if (postErr) throw createError({ statusCode: 500, statusMessage: postErr.message })
    //   return postData

    // default:
    //   throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }
})