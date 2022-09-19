const formKitTailwind = require('@formkit/themes/tailwindcss')

module.exports = {
  content: ['./**/*.vue', './src/theme.ts', './src/libs/z-index.ts'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        white: '#f4f6fc',
        gray: '#ccdcf2',
        cyan: '#70def1',
        blue: '#5a7bb5',
        'blue-tint': '#7b95c4',
        'blue-shade': '#486291',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), formKitTailwind],
}
