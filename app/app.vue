<template>
  <div class="min-h-screen w-full relative font-['Courier_New',monospace] bg-[#008080]">
    <div v-show="!showContent" class="fixed inset-0 z-50 flex flex-col items-center justify-end p-6 transition-all duration-700" 
        :class="isLoaded ? 'backdrop-blur-sm bg-black/30' : ''">
      
      <img src="~/assets/img/hamburger.gif" alt="Invitation" 
          class="absolute inset-0 w-full h-full object-contain -z-10 transition-all duration-700"
          :class="isLoaded ? 'opacity-40 blur-[1px]' : ''" />

      <div v-if="!isLoaded" class="w-full max-w-[600px] bg-[#c0c0c0] border-2 border-white border-b-black border-r-black p-1 mb-8 shadow-xl">
        <div class="bg-white border border-[#808080] h-6 relative flex items-center overflow-hidden">
          <div class="bg-[#000080] h-full transition-all duration-[5000ms] ease-linear" :style="{ width: loadingProgress + '%' }"></div>
          <span class="absolute w-full text-center text-[14px] font-bold tracking-wider mix-blend-difference text-white"> 로     딩     중 ...  ( {{ loadingCount }} seconds)</span>
        </div>
      </div>

      <button v-else @click="handleOpenClick"
              class="mb-12 bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-b-black border-r-black px-12 py-3 text-lg font-bold hover:bg-[#d0d0d0] active:translate-y-[1px] shadow-lg animate-bounce">
        초대장 열기
      </button>
    </div>

    <div v-show="showContent" class="w-full max-w-[480px] bg-[#c0c0c0] p-1 border-2 border-white border-b-black border-r-black mx-auto">
      <div class="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-0.5 flex justify-between items-center mb-2">
        <span class="text-[11px] font-bold tracking-wide">청 첩 장.exe</span>
        <button @click="showContent = false" class="text-[10px] bg-[#c0c0c0] text-black px-1 border border-black">X</button>
      </div>
      <UiWindowFrame title="message.txt"><SectionsMessage /></UiWindowFrame>
      <UiWindowFrame v-if="showContent" title="schedule.ini"><SectionsSchedule /></UiWindowFrame>
      <UiWindowFrame title="gallery.exe"><SectionsGallery /></UiWindowFrame>
      <UiWindowFrame title="bank.txt"><SectionsBankContact /></UiWindowFrame>
      <UiWindowFrame title="footer.sys"><SectionsFooter /></UiWindowFrame>
    </div>
  </div>
</template>

<script setup>
  const showContent = ref(false);
  const loadingProgress = ref(0);
  const loadingCount = ref(5);
  const isLoaded = ref(false);
  const imageTimestamp =  useState('imageTimestamp', () => '');
  const { play } = useSound('data:audio/wav;base64,UklGRksCAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YScCAACAwOvz16FgKxEaQ3644OjQn2U0HCNIfbLW38mdaTwmLEx8rM3Ww5tsQy4zUHunxc69mm9KNjpUeqK+xriYcVA9QFd6nrjAs5d0VURGWnqasrqvlXVZSktdeZettKuUd15PUGB5lKivp5N5YVRUYnmSpKukkXplWFhleY+gpqCQe2hcXGd5jZ2jno98amBfaXmMmp+bjn1tY2JreoqXnJiNfW9mZWx6iZWalox+cWhnbnqIkpeUi35ya2lveoeQlZKKf3RtbHF6ho+TkYl/dW9tcnuFjZGPiX92cG9ze4SMj46IgHdycXR7g4qOjYeAeHNydXuDiYyLh4B5dHN2fIKIi4qGgHp2dHd8goeKiYaAe3d1eHyChomIhYB7d3Z4fIGGiIiFgHx4d3l8gYWHh4SAfHl4eX2BhIaGhIB9enl6fYGEhoaEgH16eXp9gIOFhYOAfXt6e32Ag4WFg4B9e3p7fYCDhISDgH58e3x9gIKEhIKAfnx7fH6AgoODgoB+fHx8foCCg4OCgH59fH1+gIGCg4KAfn18fX6AgYKCgoB/fX19foCBgoKBgH9+fX1+gIGCgoGAf359fX5/gYGCgYB/fn1+fn+BgYGBgH9+fn5+f4CBgYGAf35+fn9/gIGBgYB/fn5+f3+AgYGBgH9/fn5/f4CBgYGAf39+fn9/gIGBgIB/f35+f3+AgIGAgH9/f39/f4CAgICAf39/f39/gICAgIB/f39/fw==');

  onMounted(() => {
    setTimeout(() => { loadingProgress.value = 100; }, 100);
    setInterval(() => { loadingCount.value -= 1; }, 1000);
    setTimeout(() => { isLoaded.value = true; }, 5000); // 3초 로딩
    imageTimestamp.value = Date.now();
  });

  const handleOpenClick = async () => {
    try {
      await play()
    }catch(err) {
      console.error("오디오 재생 실패:", err)
    }finally {
      setTimeout(()=>{
        showContent.value = true // .value 잊지 말고 적용!
      }, 1000);
    }
  }
</script>