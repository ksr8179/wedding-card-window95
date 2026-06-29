import { loadScript } from './script';

export const loadKakaoNavi = async (): Promise<any> => {
  const config = useRuntimeConfig();

  if (!import.meta.client) return;
  if (window.Kakao?.Navi) return window.Kakao;

  //const APP_KEY = config.public.kakaoApiKey;
  const APP_KEY = "df3fe0c0e3f30f2ffd5279039ab48dff";
  const NAVI_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js';

  try {
    await loadScript(NAVI_URL);

    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(APP_KEY);
    }
    return window.Kakao;
  } catch (error) {
    console.error('카카오 SDK 로드 실패', error);
    throw error;
  }
};
