export const useInvitationNavi = () => {
  const config = useRuntimeConfig()

  const openScheme = (scheme: string, fallback: string) => {
    if (!import.meta.client) return
    const started = Date.now()
    window.location.href = scheme
    window.setTimeout(() => {
      if (Date.now() - started < 1800) {
        window.location.href = fallback
      }
    }, 900)
  }

  const openKakaoNavi = (destination: { name: string; lat: number; lng: number }) => {
    const name = encodeURIComponent(destination.name)
    const scheme = `kakaonavi://navigate?name=${name}&x=${destination.lng}&y=${destination.lat}&coord_type=wgs84`
    const fallback = `https://map.kakao.com/link/to/${name},${destination.lat},${destination.lng}`
    openScheme(scheme, fallback)
  }

  const openTmap = (destination: { name: string; lat: number; lng: number }) => {
    const name = encodeURIComponent(destination.name)
    const scheme = `tmap://route?goalx=${destination.lng}&goaly=${destination.lat}&goalname=${name}`
    const appKey = config.public.tmapAppKey as string | undefined
    const fallback = appKey
      ? `https://apis.openapi.sk.com/tmap/app/routes?appKey=${appKey}&goalname=${name}&goalx=${destination.lng}&goaly=${destination.lat}`
      : `https://www.tmap.co.kr/tmap2/mobile/tmap.jsp?name=${name}&lon=${destination.lng}&lat=${destination.lat}`
    openScheme(scheme, fallback)
  }

  return { openKakaoNavi, openTmap }
}
