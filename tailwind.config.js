module.exports = {
  mode: 'jit',
  purge: [
    './src/pages/**/*.{js,ts,tsx}',
    './src/components/**/*.{js,ts,tsx}',
    './src/config/**/*.{js,ts}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: `Lato, Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'`,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
