// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts'], // @nuxt/fonts도 꼭 넣으세요!
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  nitro: {
    preset: 'github_pages',
  },

  // 2. 앱 경로 설정
  app: {
    // 실제 저장소 이름으로 변경
    baseURL: '/wedding-card-window95/',
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})