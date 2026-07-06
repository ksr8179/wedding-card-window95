import clickSound from '@/assets/sounds/mouse_click.mp3';

export function useSound() {
    const audio = new Audio(clickSound); // 사운드 파일 경로
    
    const playMouseClickSound = () => {
        // 연속 클릭 시 소리가 겹치거나 끊기지 않도록 재생 위치를 초기화합니다.
        audio.currentTime = 0;
        audio.play().catch((error) => {
            console.warn('오디오 재생 실패 (사용자 상호작용 필요):', error);
        });
    };

    return {
        playMouseClickSound
    };

}

