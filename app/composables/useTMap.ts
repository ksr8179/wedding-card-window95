export const useTMap = () => {
    const config = useRuntimeConfig();

    const startTmapNavigation = async (destination : {name: string, x:number, y:number}) => {
        const appKey = config.public.TmapAppKey;

        window.location.href = 'https://apis.openapi.sk.com/tmap/app/routes?' 
                             + 'appKey=' + appKey
                             + '&goalname=' + destination.name
                             + '&goalx=' + destination.x
                             + '&goaly=' + destination.y;
    };

    return {
        startTmapNavigation
    }
}