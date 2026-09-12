export const useTMap = () => {
  const config = useRuntimeConfig()

  const startTmapNavigation = async (destination: { name: string; x: number; y: number }) => {
    if (!import.meta.client) return

    const name = encodeURIComponent(destination.name)
    const appKey = String(config.public.tmapAppKey || '')

    const url = appKey
      ? `https://apis.openapi.sk.com/tmap/app/routes?appKey=${appKey}&goalname=${name}&goalx=${destination.x}&goaly=${destination.y}`
      : `https://www.tmap.co.kr/tmap2/mobile/tmap.jsp?name=${name}&lon=${destination.x}&lat=${destination.y}`

    window.location.href = url
  }

  return {
    startTmapNavigation,
  }
}
