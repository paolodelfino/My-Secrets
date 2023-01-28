/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/scripts/*.js", "./public/stylesheets/css/*.css", "./public/stylesheets/sass/*.css", "./views/pages/*.ejs", "./views/partials/*.ejs"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    styled: true,
    themes: [
      "business"
    ],
  }
}