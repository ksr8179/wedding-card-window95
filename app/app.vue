<template>
  <div class="min-h-screen bg-[#008080] flex items-center justify-center p-2 font-['MS_Sans_Serif',Arial,sans-serif]">
    
    <div v-if="!showContent" class="text-center">
      <div class="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black p-8">
        <h1 class="mb-6 font-bold">WEDDING_INVITATION.EXE</h1>
        <button 
          @click="showContent = true"
          class="bg-[#c0c0c0] border-2 border-white border-b-black border-r-black px-6 py-2 active:translate-y-[2px]"
        >
          초대장 열기
        </button>
      </div>
    </div>

    <div v-else class="w-full max-w-[480px] bg-[#c0c0c0] p-1 border-2 border-white border-b-black border-r-black">
      <div class="bg-[#000080] text-white px-2 py-1 flex justify-between items-center mb-2">
        <span class="text-xs font-bold">wedding_invitation.exe</span>
        <button @click="showContent = false" class="text-[10px] bg-[#c0c0c0] text-black px-1 border border-black">X</button>
      </div>

      <div class="max-h-[80vh] overflow-y-auto space-y-3 p-1">
        <UiWindowFrame title="message.txt"><SectionsMessage /></UiWindowFrame>
        <UiWindowFrame title="schedule.ini"><SectionsSchedule /></UiWindowFrame>
        <UiWindowFrame title="gallery.exe"><SectionsGallery /></UiWindowFrame>
        <UiWindowFrame title="bank.txt"><SectionsBankContact /></UiWindowFrame>
        <UiWindowFrame title="footer.sys"><SectionsFooter /></UiWindowFrame>
      </div>
    </div>
  </div>
</template>

<script setup>
const showContent = ref(false);
</script>