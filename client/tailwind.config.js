/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
   extend:{
    keyframes: {
      typing: {
        '0%': { width: '0%' },
        '100%': { width: '100%' },
      },
      blink: {
        '50%': { 'border-color': 'transparent' },
      },
    },
    animation: {
      typing: 'typing 3s steps(30, end) forwards, blink 0.75s step-end infinite',
    },
   },
  },
  plugins: [ require('daisyui'),
  require('flowbite')
  ],
  daisyui: {
    themes: ["light"],
  },
}

