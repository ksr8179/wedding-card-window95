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
    ImgPath : '/storage/v1/object/public/uploads/',
    mouseSound : 'data:audio/wav;base64,UklGRmACAABXQVZFZm10IBAAAAABAAEAESsAABErAAABAAgAZGF0YV8CAACAgICAf3m6w9u7WCsRJkN8uOHp0p9mNBwjSX6y2N/Jnmk8JixMfKvM1sObbEMuM1B7p8XOvZpvSjY6VHqivsa4mHFQPUBXep64wLOXdVVERlp6mrK6r5V1WUpLXXmXrbSrlHdeT1BgeZSor6eTeWFUbXmSoayknXlkWFljeY2eoJ6OfWxkXWh5i5ebmI18bWNiaXmKlZuYjHxvZmRpeYiTlpSLfXFpZ256h5CVkot9cmtpbXmHkJSSh390bGxxekWPkpGJfnRubHJ6hY2RkId9dXFuc3uEi4+Nh4B3c3F1e4OJjIuHgHl0c3Z8goiLiYWAenV0d3yChomJhYB7dnV4fIKGiYiFgHt3dnh8gYaIiIWAfHh3eXuChYeHhIB8eXh5fYGEhoaEgH16eXp9gYSGhoSAfXp5en2Ag4WFg4B9e3p7fYCDhYWDgH17enp9gIOEhIOAfnx7fH2AgoSEgoB+fHt8foCCg4OCgH58fHx+gIKDg4KAfX18fX6AgYKDgoB+fXx9foCBgoKCgH99fX1+gIGCgoGAf359fX6AgYKCgoB+fn19fn+BgYGBgH9+fn5+f4CBgYGAf35+fn9/gIGBgYB/fn5+f3+AgYGBgH9/fn5/f4CBgYGAf39+fn9/gIGBgIB/f35+f3+AgIGAgH9/f39/f4CAgICAf39/f39/gICAgIB/f39/fw=='
  };