<template>
  <div class="text-center text-[10px] text-[#000080]">
    <p>© 2026 Wedding Invitation. All rights reserved.</p>
    <button @click="shareKakao" class="mt-2 bg-[#fee500] border border-black px-2 py-1">
      카카오톡으로 공유하기
    </button>
  </div>
</template>

<script setup>
const { shareKakaoMessage } = useKakaoShare;

useHead({
  meta: [
    { property: 'og:title', content: '썽래와 혜민의 결혼식에 초대합니다' },
    { property: 'og:description', content: '2026.07.15 | 청첩장을 확인해보세요.' },
    { property: 'og:image', content: '/og-thumbnail.jpg' }
  ]
});

const shareKakao = () => {
  shareKakaoMessage();
};
</script>