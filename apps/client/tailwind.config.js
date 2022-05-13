module.exports = {
  content: ['./**/*.vue'],
  darkMode: 'class',
  theme: {
    colors: {
      white: "#f4f6fc",
      gray: "#ccdcf2",
      cyan: "#70def1",
      blue: "#5a7bb5",
      "blue-tint": "#7b95c4",
      "blue-shade": "#486291"
    }
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
