import { weddingConfig as config } from '~/config/wedding.config';

export const useKakaoShare = () => {
  const shareKakaoMessage = async () => {
    if (!import.meta.client) return;

    try {
      // 1. utils의 SDK 로더 호출
      const kakao = await loadKakaoSDK();

      Kakao.Share.sendDefault({
        objectType: 'text',
        text: config.message.title + config.message.content,
        link: {
          // [앱] > [제품 링크 관리] > [웹 도메인]에서 등록한 사이트 도메인과 일치해야 함
          mobileWebUrl: config.WebUrl,
          webUrl: config.WebUrl,
        },
      });
    } catch (error) {
      console.error('공유하기 실행 실패:', error);
    }
  };

  return {
    shareKakaoMessage
  };
};
