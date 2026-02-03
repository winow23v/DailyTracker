/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-muted)',
        bg: 'var(--color-bg)'
      },
      spacing: {
        18: '4.5rem'
      },
      borderRadius: {
        lg: '12px'
      }
    }
  },
  plugins: [],
  // Notes:
  // - Map CSS variables (defined in src/app/globals.css) to Tailwind tokens above.
  // - To use dark-mode token switching, consider adding a plugin or using
  //   class-based dark mode and toggling a root class in ThemeProvider.
  // - For animations respecting reduced motion, use the `motion-safe` and
  //   `motion-reduce` utilities.
}
