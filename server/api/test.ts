// server/api/ping.ts (아무 설정도, Supabase도 쓰지 않는 순수 파일)
export default defineEventHandler(() => {
    return { message: "pong" }
  })
  