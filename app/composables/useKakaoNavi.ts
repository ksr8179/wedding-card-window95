export const useKakaoNavi = () => {
  const isNaviLoading = ref(false);

  const startNavigation = async (destination: { name: string; x: number; y: number }) => {
    if (!import.meta.client) return;

    isNaviLoading.value = true;
    try {
      // 1. utils의 내비 로더 호출
      const kakao = await loadKakaoNavi();

      // 2. 카카오내비 실행
      kakao.Navi.start({
        name: destination.name,
        x: destination.x,
        y: destination.y,
        coordType: 'wgs84',
      });
    } catch (error) {
      console.error('내비게이션 실행 실패:', error);
    } finally {
      isNaviLoading.value = false;
    }
  };

  return {
    isNaviLoading,
    startNavigation
  };
};
