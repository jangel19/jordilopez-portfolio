import tailwind from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwind(),       // the new Tailwind PostCSS plugin
    autoprefixer(),
  ]
}