import { weddingConfig as config } from '~/config/wedding.config';

export const useKakaoShare = () => {
  const shareKakaoMessage = async () => {
    if (!import.meta.client) return;

    try {
      // 1. utils의 SDK 로더 호출
      const kakao = await loadKakaoSDK();

      Kakao.Share.sendCustom({
        templateId: 134868,  // 공유 할 메시지 템플릿 ID 입력
        templateArgs: true,  // 메시지 템플릿에 설정한 사용자 인자 JSON 입력
      });
    } catch (error) {
      console.error('공유하기 실행 실패:', error);
    }
  };

  return {
    shareKakaoMessage
  };
};
