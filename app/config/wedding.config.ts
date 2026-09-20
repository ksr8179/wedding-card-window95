export const weddingConfig = {
  couple: {
    groom: {
      ko: '김성래',
      en: 'Sung rae',
    },
    bride: {
      ko: '장혜민',
      en: 'Hye min',
    },
    title: 'We Are Getting Married!',
    kicker: 'JOIN US TO CELEBRATE\nTHE WEDDING OF',
    footer: 'PLEASE JOIN US TO CELEBRATE\nOUR SPECIAL DAY',
  },

  greeting: {
    title: '소중한 분들을 초대합니다',
    body: `서로 다른 색으로 살아온 두 사람이 만나
하나의 풍경이 되려 합니다.

따뜻한 마음 모아 축복해 주시면
그 마음이 우리의 첫 계절이 될 것입니다.

부디 오셔서 저희의 시작을
함께 빛내 주세요.`,
  },

  schedule: {
    weekdayEn: 'SATURDAY',
    weekdayKo: '토요일',
    dateEn: 'JANUARY 30, 2027',
    dateKo: '2027년 1월 30일',
    dateISO: '2027-01-30',
    timeEn: '1:20 PM',
    timeKo: '오후 1시 20분',
    venueEn: 'MBC Convention Jinju',
    venueKo: 'MBC컨벤션진주 1관 컨벤션홀',
    address: '경상남도 진주시 동진로 415 진주종합경기장내',
    lat: 35.18294,
    lng: 128.136668,
  },

  photos: {
    left: '/images/left_image.JPG',
    right: '/images/right_image.JPG',
    welcome: '/images/welcome_cover.jpg',
  },

  gallery: {
    imgPath: '/storage/v1/object/public/uploads/',
    gubun: null as string | null,
  },

  livePhotos: {
    bucket: 'live-photos',
    maxWidthOrHeight: 1200,
    quality: 0.8,
    maxOriginalMb: 15,
    // Asia/Seoul 기준 이 날짜 0시부터 업로드 가능. 닫는 날짜를 넣으면 그날 24시까지.
    // 삭제 테스트용으로 임시 개방. 끝나면 예식일(2027-01-30)로 되돌린다.
    opensOn: '2026-09-20',
    closesOn: null as string | null,
  },

  music: {
    src: '/audio/wedding_sound.mp3',
    volume: 0.45,
  },

  // 계좌번호는 저장소에 남기지 않는다. key로 runtimeConfig.public.accountNumbers를 찾아 쓴다.
  accounts: {
    groomSide: {
      label: '신랑측',
      people: [
        {
          key: 'groom',
          relation: '신랑',
          name: '김성래',
          bank: '부산은행',
          kakaoPayUrl: 'https://qr.kakaopay.com/Ej8BcUYjE',
        },
        {
          key: 'groomFather',
          relation: '혼주 (부)',
          name: '김남호',
          bank: '부산은행',
        },
        {
          key: 'groomMother',
          relation: '혼주 (모)',
          name: '박송',
          bank: '부산은행',
        },
      ],
    },
    brideSide: {
      label: '신부측',
      people: [
        {
          key: 'bride',
          relation: '신부',
          name: '장혜민',
          bank: '국민은행',
          kakaoPayUrl: 'https://qr.kakaopay.com/FdMM0Tucg',
        },
        {
          key: 'brideFather',
          relation: '혼주 (부)',
          name: '장중진',
          bank: '국민은행',
        },
        {
          key: 'brideMother',
          relation: '혼주 (모)',
          name: '정덕순',
          bank: '농협',
        },
      ],
    },
  },

} as const

export const weddingSeo = {
  title: `${weddingConfig.couple.groom.en} & ${weddingConfig.couple.bride.en} | Wedding Invitation`,
  description: `${weddingConfig.couple.groom.ko} ♥ ${weddingConfig.couple.bride.ko} 결혼식에 초대합니다. ${weddingConfig.schedule.dateKo} ${weddingConfig.schedule.venueKo}`,
  ogTitle: `${weddingConfig.couple.groom.ko} ♥ ${weddingConfig.couple.bride.ko} 결혼식에 초대합니다`,
  ogDescription: `${weddingConfig.schedule.dateEn} ${weddingConfig.schedule.timeEn} · ${weddingConfig.schedule.venueEn}`,
  ogImage: weddingConfig.photos.left,
}

export type AccountPerson =
  | (typeof weddingConfig.accounts.groomSide.people)[number]
  | (typeof weddingConfig.accounts.brideSide.people)[number]
