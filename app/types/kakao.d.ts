export {}

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void
        LatLng: new (lat: number, lng: number) => KakaoLatLng
        Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap
        Marker: new (options: { position: KakaoLatLng }) => KakaoMarker
      }
    }
  }
}

interface KakaoLatLng {}
interface KakaoMap {}
interface KakaoMarker {
  setMap: (map: KakaoMap) => void
}
