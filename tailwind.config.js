/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
      },
      colors: {
        secondary: '#3dc2ff',
        tertiary: '#5260ff',
        primary: '#eb445a',
        success: '#2dd36f',
        warning: '#ffc409',
        danger: '#eb445a',
        medium: '#92949c',
        light: '#f4f5f8',
        dark: '#222428',
      },
    },
  },
  plugins: [],
}
