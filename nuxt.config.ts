// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts', '@nuxt/image', '@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  supabase: {
    // 자동 로그인 리다이렉션 기능을 완전히 끕니다.
    redirect: false 
  },
  image: {
    provider: 'ipx',
    domains: [process.env.SUPABASE_URL || 'localhost'], // 본인의 supabase 프로젝트 도메인 등록
    ipx: {
      modifiers: {
        rotate: 'auto' // 또는 true (버전에 따라 다름, 보통 생략해도 sharp 내부에서 auto 처리되나 명시적 지정)
      }
    }
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
      TmapAppKey: process.env.TMAP_APP_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    }
  }
})