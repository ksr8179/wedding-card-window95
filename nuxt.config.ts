// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts'], // @nuxt/fonts도 꼭 넣으세요!
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  // nitro: {
  //   preset: 'github_pages',
  // },

  // 2. 앱 경로 설정
  app: {
    baseURL: '/',
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    // 서버 사이드에서만 접근 가능 (비밀 키 등)
    //kakaoApiKey: process.env.KAKAO_API_KEY, 

    public: {
      // 클라이언트와 서버 모두 접근 가능 (API 주소 등)
      kakaoApiKey: process.env.KAKAO_API_KEY, 
      TmapAppKey: process.env.TMAP_APP_KEY
    }
  }
})