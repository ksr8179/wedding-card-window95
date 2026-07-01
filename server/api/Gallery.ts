// import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

// export default defineEventHandler(async (event) => {
//   const user = await serverSupabaseUser(event)
//   const client = await serverSupabaseClient(event)
//   const method = event.method

//   // 1. 보호된 API (로그인 사용자만 접근 가능)
//   if (!user) {
//     throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
//   }

//   // 2. 메서드에 따른 분기 처리
//   switch (method) {
//     case 'GET':
//       const { data: getList, error: getErr } = await client
//         .from('todos')
//         .select('*')
//         .eq('user_id', user.id)
//       if (getErr) throw createError({ statusCode: 500, statusMessage: getErr.message })
//       return getList

//     case 'POST':
//       const body = await readBody(event)
//       const { data: postData, error: postErr } = await client
//         .from('todos')
//         .insert({ ...body, user_id: user.id })
//       if (postErr) throw createError({ statusCode: 500, statusMessage: postErr.message })
//       return postData

//     default:
//       throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
//   }
// })