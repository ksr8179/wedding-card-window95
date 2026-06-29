import { loadScript } from './script';

export const loadKakaoMap = (): Promise<any> => {
  const config = useRuntimeConfig();
  
  return new Promise((resolve, reject) => {
    if (!import.meta.client) return reject('Client-side only');
    if (window.kakao?.maps) return resolve(window.kakao.maps);

    // 카카오맵은 뒤에 autoload=false를 붙여야 제어가 가능합니다.
    //const APP_KEY = config.public.kakaoApiKey;
    const APP_KEY = "df3fe0c0e3f30f2ffd5279039ab48dff";
    const MAP_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${APP_KEY}&autoload=false`;
    
    // 기존에 남아있는 카카오 스크립트 제거 (HMR 충돌 방지)
    const existingScript = document.querySelector(`script[src="${MAP_URL}"]`);
    if (existingScript) {
        existingScript.remove();
    }

    loadScript(MAP_URL)
      .then(() => {
        window.kakao.maps.load(() => {
          resolve(window.kakao.maps);
        });
      })
      .catch(reject);
  });
};
