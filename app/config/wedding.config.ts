// config/wedding.config.ts
export const weddingConfig = {
    // 1. 헤어로 섹션
    hero: {
      title: "WEDDING INVITATION",
      names: ["김철수", "이영희"],
      date: "2026.07.15",
    },
    // 2. 초대 문구
    message: {
      title: "두 사람의 시작에 초대합니다.\n",
      content: "\n서로 다른 색으로 살아온 두 사람이 만나\n하나의 풍경이 되려 합니다.\n부디 오셔서 저희의 시작을 축복해 주세요.\n",
    },
    // 3. 날짜 및 장소
    schedule: {
      date: "2026년 7월 15일 (토)",
      time: "오후 2시",
      location: "서울시 강남구 레트로 웨딩홀 3층",
      address: "서울시 강남구 테헤란로 123",
    },
    // 4. 계좌 정보
    accounts: {
      groom: { name: "김철수", bank: "국민은행", number: "123-456-7890" },
      bride: { name: "이영희", bank: "신한은행", number: "098-765-4321" },
    },
    // 5. 연락처
    contacts: {
      groom: "010-1234-5678",
      bride: "010-9876-5432",
    },
    gallery: [
        "https://your-supabase-url.supabase.co/storage/v1/object/public/wedding/pic1.jpg",
        "https://your-supabase-url.supabase.co/storage/v1/object/public/wedding/pic2.jpg"
      ]
  };