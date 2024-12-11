/** @type {import('tailwindcss').Config} */
module.exports = {
  // mode: 'jit',
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px', // Define xs as 480px or any value you prefer
        '3xl': '1920px', // custom breakpoint for 1920px
        '4xl': '2560px', // custom breakpoint for 2560px
      },
      maxWidth: {
          'screen-3xl': '1920px',
          'screen-4xl': '2560px',
      },
      fontSize: {
        'xs-sm': '10px',
        'md-lg': '16px',
      },
    },
  },
  plugins: [],
}

