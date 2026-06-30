// config/wedding.config.ts
export const weddingConfig = {
    // 1. 헤어로 섹션
    hero: {
      title: "WEDDING INVITATION",
      names: ["김성래", "장혜민"],
      date: "202x.xx.xx",
    },
    // 2. 초대 문구
    message: {
      title: "두 사람의 시작에 초대합니다.\n",
      content: "\n서로 다른 색으로 살아온 두 사람이 만나\n하나의 풍경이 되려 합니다.\n부디 오셔서 저희의 시작을 축복해 주세요.\n",
    },
    // 3. 날짜 및 장소
    schedule: {
      date: "202x년 x월 xx일 (토)",
      time: "오후 2시",
      location: "xx시 xx구 xx로 웨딩홀 3층",
      address: "xx시 xx구 xx로 123",
      lat : 35.1782,
      lng : 128.1365
    },
    // 4. 계좌 정보
    accounts: {
      groom: { name: "김성래", bank: "국민은행", number: "123-456-7890" },
      bride: { name: "장혜민", bank: "신한은행", number: "098-765-4321" },
    },
    // 5. 연락처
    contacts: {
      groom: "010-1234-5678",
      bride: "010-9876-5432",
    },
    gallery: [
      "https://your-supabase-url.supabase.co/storage/v1/object/public/wedding/pic1.jpg",
      "https://your-supabase-url.supabase.co/storage/v1/object/public/wedding/pic2.jpg"
    ],
    WebUrl: 'https://wedding-card-window95.vercel.app/'

  };