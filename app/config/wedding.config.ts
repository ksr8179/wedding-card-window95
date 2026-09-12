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
    timeEn: '1:20 PM',
    timeKo: '오후 1시 20분',
    venueEn: 'MBC Convention Jinju',
    venueKo: 'MBC컨벤션진주 1관 컨벤션홀',
    address: '경상남도 진주시 동진로 415 진주종합경기장내',
    lat: 35.1829,
    lng: 128.1358,
  },

  photos: {
    left: '/images/invitation-cover.jpg',
    right: '/images/invitation-cover.jpg',
    welcome: '/images/welcome_cover.jpg',
  },

  gallery: {
    imgPath: '/storage/v1/object/public/uploads/',
  },

  music: {
    src: '/audio/wedding_sound.mp3',
    volume: 0.45,
  },

  accounts: {
    groomSide: {
      label: '신랑측',
      people: [
        {
          relation: '신랑',
          name: '김성래',
          bank: '부산은행',
          number: '241-12-030845-2',
          kakaoPayUrl: 'https://qr.kakaopay.com/Ej8BcUYjE',
        },
        {
          relation: '혼주 (부)',
          name: '김남호',
          bank: '부산은행',
          number: '110-111-222222',
        },
        {
          relation: '혼주 (모)',
          name: '박송',
          bank: '부산은행',
          number: '110-333-444444',
        },
      ],
    },
    brideSide: {
      label: '신부측',
      people: [
        {
          relation: '신부',
          name: '장혜민',
          bank: '국민은행',
          number: '098-765-4321',
          kakaoPayUrl: 'https://qr.kakaopay.com/example-bride',
        },
        {
          relation: '혼주 (부)',
          name: '장중진',
          bank: '우리은행',
          number: '1002-000-000000',
        },
        {
          relation: '혼주 (모)',
          name: '정덕순',
          bank: '우리은행',
          number: '1002-111-111111',
        },
      ],
    },
  },

  contacts: {
    groom: '010-7244-8179',
    bride: '010-9116-7592',
  },
} as const

export type WeddingConfig = typeof weddingConfig
export type AccountPerson = (typeof weddingConfig.accounts.groomSide.people)[number]
