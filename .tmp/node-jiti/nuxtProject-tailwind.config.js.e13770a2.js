"use strict";/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{vue,js,ts,jsx,tsx}",
      "./components/**/*.{vue,js,ts,jsx,tsx}",
      "./pages/**/*.{vue,js,ts,jsx,tsx}",
      "./layouts/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        // 레트로한 빈티지 색상 팔레트 추가
        colors: {
          'vintage-paper': '#f4e4bc',
          'newspaper-bg': '#dcd6cc',
          'ink-black': '#1a1a1a',
        },
        // 레트로 폰트 설정 (구글 폰트에서 가져올 예정)
        fontFamily: {
          serif: ['"Nanum Myeongjo"', 'serif'],
        },
      },
    },
    plugins: [],
  } /* v7-8cd657cb6aefe02c */