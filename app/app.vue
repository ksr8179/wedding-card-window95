<template>
  <div class="min-h-screen w-full relative font-['Courier_New',monospace] bg-[#008080]">
    <Transition 
      name="retro"
      mode="out-in"
      enter-active-class="duration-75 ease-linear"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="duration-75 ease-linear"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95">
      <div v-show="!showContent" class="fixed inset-0 z-50 flex flex-col items-center justify-end p-6 transition-all duration-700" 
          :class="isLoaded ? 'backdrop-blur-sm bg-black/30' : ''">
        
        <img src="~/assets/img/hamburger.gif" alt="Invitation" 
            class="absolute inset-0 w-full h-full object-contain -z-10 transition-all duration-700"
            :class="isLoaded ? 'opacity-40 blur-[1px]' : ''" />

        <div v-if="!isLoaded" class="w-full max-w-[600px] bg-[#c0c0c0] border-2 border-white border-b-black border-r-black p-1 mb-8 shadow-xl">
          <div class="bg-white border border-[#808080] h-6 relative flex items-center overflow-hidden">
            <div class="bg-[#000080] h-full transition-all duration-[3000ms] ease-linear" :style="{ width: loadingProgress + '%' }"></div>
            <span class="absolute w-full text-center text-[14px] font-bold tracking-wider mix-blend-difference text-white"> 로     딩     중 ...  ( {{ loadingCount }} seconds)</span>
          </div>
        </div>

        <button v-else @click="showContent = true"
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
        <UiWindowFrame title="schedule.ini"><SectionsSchedule /></UiWindowFrame>
        <UiWindowFrame title="gallery.exe"><SectionsGallery /></UiWindowFrame>
        <UiWindowFrame title="bank.txt"><SectionsBankContact /></UiWindowFrame>
        <UiWindowFrame title="footer.sys"><SectionsFooter /></UiWindowFrame>
        </div>
    </Transition>
  </div>
</template>

<script setup>
  const showContent = ref(false);
  const loadingProgress = ref(0);
  const loadingCount = ref(3);
  const isLoaded = ref(false);
  const imageTimestamp = useState('imageTimestamp', () => '')

  onMounted(() => {
    setTimeout(() => { loadingProgress.value = 100; }, 100);
    setInterval(() => { loadingCount.value -= 1; }, 1000);
    setTimeout(() => { isLoaded.value = true; }, 3000); // 3초 로딩

    imageTimestamp.value = Date.now();
  });
</script>