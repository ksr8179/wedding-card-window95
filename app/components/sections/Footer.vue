<template>
  <div class="text-center text-[10px] text-[#000080]">
    <p>© 2026 Wedding Invitation. All rights reserved.</p>
    <button @click="shareKakao" class="mt-2 bg-[#fee500] border border-black px-2 py-1">
      카카오톡으로 공유하기
    </button>
  </div>
</template>

<script setup>
useHead({
  meta: [
    { property: 'og:title', content: '철수와 영희의 결혼식에 초대합니다' },
    { property: 'og:description', content: '2026.07.15 | 레트로한 청첩장을 확인해보세요.' },
    { property: 'og:image', content: '/og-thumbnail.jpg' }
  ]
});

const shareKakao = () => {
  alert("카카오톡 SDK를 통해 친구에게 공유합니다.");
};
</script>