module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './sections/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: theme => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.blue.600'),
              '&:hover': {
                color: theme('colors.blue.700'),
              },
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.100'),

            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            h5: {
              color: theme('colors.gray.100'),
            },
            h6: {
              color: theme('colors.gray.100'),
            },

            strong: {
              color: theme('colors.gray.100'),
            },

            blockquote: {
              color: theme('colors.gray.100'),
            },

            code: {
              color: theme('colors.gray.100'),
            },

            figcaption: {
              color: theme('colors.gray.500'),
            },

            hr: {
              borderColor: theme('colors.gray.700'),
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
