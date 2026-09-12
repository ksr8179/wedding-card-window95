import { weddingSeo } from './app/config/wedding.config'

const readEnv = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key]?.trim().replace(/^['"]|['"]$/g, '')
    if (value) return value
  }
  return ''
}

const supabaseUrl = readEnv('NUXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL')
const supabaseKey = readEnv(
  'NUXT_PUBLIC_SUPABASE_KEY',
  'NUXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_KEY',
  'SUPABASE_ANON_KEY',
  'SUPABASE_PUBLISHABLE_KEY',
  'NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
)

const supabaseHost = (() => {
  try {
    return supabaseUrl ? new URL(supabaseUrl).host : 'localhost'
  } catch {
    return 'localhost'
  }
})()

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
    url: supabaseUrl || undefined,
    key: supabaseKey || undefined,
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
    domains: [supabaseHost],
  },
  app: {
    baseURL: '/',
    head: {
      title: weddingSeo.title,
      htmlAttrs: { lang: 'ko' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'description', content: weddingSeo.description },
        { property: 'og:title', content: weddingSeo.ogTitle },
        { property: 'og:description', content: weddingSeo.ogDescription },
        { property: 'og:image', content: weddingSeo.ogImage },
      ],
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    kakaoRestApiKey: process.env.KAKAO_REST_API_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      kakaoJsKey: process.env.NUXT_PUBLIC_KAKAO_JS_KEY || process.env.KAKAO_API_KEY,
      kakaoApiKey: process.env.NUXT_PUBLIC_KAKAO_JS_KEY || process.env.KAKAO_API_KEY,
      tmapAppKey: process.env.NUXT_PUBLIC_TMAP_APP_KEY || process.env.TMAP_APP_KEY,
      supabaseUrl,
      supabaseKey,
    },
  },
})
