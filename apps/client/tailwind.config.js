const formKitTailwind = require('@formkit/themes/tailwindcss')

module.exports = {
  content: ['./**/*.vue', './src/theme.ts', './src/libs/z-index.ts'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        white: '#f4f6fc',
        $white: '#0a1126',
        gray: '#ccdcf2',
        $gray: '#091423',
        cyan: '#70def1',
        'cyan-tint': '#8de5f4',
        'cyan-shade': '#65c8d9',
        $cyan: '#031b20',
        blue: '#5a7bb5',
        $blue: '#080c12',
        'blue-tint': '#7b95c4',
        '$blue-tint': '#090e16',
        'blue-shade': '#486291',
        '$blue-shade': '#07090e',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), formKitTailwind],
}
