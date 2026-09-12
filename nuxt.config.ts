// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts', '@nuxt/image', '@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  supabase: {
    redirect: false,
    // 로컬에서 .env가 없어도 앱이 부팅되도록 placeholder를 둡니다.
    // Vercel/로컬 .env의 SUPABASE_URL · SUPABASE_KEY가 있으면 그 값이 우선합니다.
    url: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    key: process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key',
  },
  fonts: {
    families: [
      { name: 'Homemade Apple', provider: 'google' },
      { name: 'Great Vibes', provider: 'google' },
      { name: 'Cormorant Garamond', weights: [400, 500, 600, 700], provider: 'google' },
      { name: 'Nanum Myeongjo', weights: [400, 700], provider: 'google' },
      { name: 'Jost', weights: [300, 400, 500, 600], provider: 'google' },
    ],
  },
  image: {
    domains: [process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'localhost'],
  },
  app: {
    baseURL: '/',
    head: {
      title: 'Sung rae & Hye min | Wedding Invitation',
      htmlAttrs: { lang: 'ko' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'description', content: '김성래 ♥ 장혜민 결혼식에 초대합니다. 2027년 1월 30일 MBC컨벤션진주' },
        { property: 'og:title', content: '김성래 ♥ 장혜민 결혼식에 초대합니다' },
        { property: 'og:description', content: '2027.01.30 SAT 1:20 PM · MBC Convention Jinju' },
        { property: 'og:image', content: '/images/invitation-cover.jpg' },
      ],
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    /**
     * 서버 전용 (Vercel Environment Variables → Server)
     * 브라우저 번들에 노출되지 않습니다.
     */
    kakaoRestApiKey: process.env.KAKAO_REST_API_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

    /**
     * 클라이언트 + 서버
     * 카카오 JavaScript 키, Supabase Anon Key는 프론트에서 필요하므로 public에 둡니다.
     * Vercel에는 NUXT_PUBLIC_* 또는 아래 키 이름을 그대로 등록하세요.
     */
    public: {
      kakaoJsKey: process.env.NUXT_PUBLIC_KAKAO_JS_KEY || process.env.KAKAO_API_KEY,
      kakaoApiKey: process.env.NUXT_PUBLIC_KAKAO_JS_KEY || process.env.KAKAO_API_KEY,
      tmapAppKey: process.env.NUXT_PUBLIC_TMAP_APP_KEY || process.env.TMAP_APP_KEY,
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
    },
  },
})
