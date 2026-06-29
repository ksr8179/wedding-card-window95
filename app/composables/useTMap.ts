export const useTMap = () => {
    const config = useRuntimeConfig();

    const startTmapNavigation = async (destination : {name: string, x:number, y:number}) => {
        const appKey = config.public.TmapAppKey;
        const data = await $fetch('/api/tmap', {
            query: {
                appKey : appKey,
                goalname : destination.name,
                goalx : destination.x,
                goaly : destination.y
            }
        });
    };

    return {
        startTmapNavigation
    }
}