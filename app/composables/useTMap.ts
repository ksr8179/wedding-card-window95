export const useTMap = () => {
    const config = useRuntimeConfig();

    const startTmapNavigation = async (name: string, x:number, y:number) => {
        const appKey = config.public.TmapAppKey;

        // 응답 데이터를 변수에 담지 않고 호출만 실행
        await $fetch('https://apis.openapi.sk.com/tmap/app/routes', {
            method: 'GET',
            query: {
                appKey : appKey,
                goalname : name,
                goalx : x,
                goaly : y
            }
        })
    };

    return {
        startTmapNavigation
    }
}