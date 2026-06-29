// server/api/tmap.get.ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    // 1. 클라이언트에서 전달한 쿼리 파라미터 가져오기
    const query = getQuery(event);
    
    // 2. TMAP API 호출 (서버 간 통신이므로 CORS 발생 안 함)
    const tmapResponse = await $fetch('https://apis.openapi.sk.com/tmap/routes', {
      method: 'GET',
      query: {
        ...query
      }
    });
  
    return tmapResponse;
  });