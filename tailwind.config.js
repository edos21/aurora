import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Lumina Custom Color Palette - Updated to match login/register theme
        background: '#0D0F12',
        foreground: '#E4E8F0',

        // Primary - Green (success, growth, positive actions)
        primary: {
          DEFAULT: '#4ADE80',
          foreground: '#0D0F12',
        },

        // Secondary - Ice Blue (technology, reliability)
        secondary: {
          DEFAULT: '#38BDF8',
          foreground: '#0D0F12',
        },

        // Accent - Purple (special highlights)
        accent: {
          DEFAULT: '#A78BFA',
          foreground: '#0D0F12',
        },

        // Destructive - Coral Red (errors, losses)
        destructive: {
          DEFAULT: '#F87171',
          foreground: '#E4E8F0',
        },

        // Muted colors for secondary text and backgrounds
        muted: {
          DEFAULT: '#15181E',
          foreground: '#A9B4C4',
        },

        // Popover and dropdown backgrounds
        popover: {
          DEFAULT: '#15181E',
          foreground: '#E4E8F0',
        },

        // Card colors
        card: {
          DEFAULT: '#15181E',
          foreground: '#E4E8F0',
        },

        // Border and input colors
        border: '#15181E',
        input: '#0D0F12',
        ring: '#4ADE80',

        // Semantic colors
        success: '#4ADE80',
        warning: '#FBBF24',
        error: '#F87171',
        info: '#38BDF8',

        // Chart colors for financial data
        chart: {
          1: '#4ADE80', // Primary green
          2: '#38BDF8', // Ice blue
          3: '#A78BFA', // Purple
          4: '#FBBF24', // Gold
          5: '#F87171', // Coral red
          6: '#34D399', // Emerald
          7: '#FB7185', // Rose
          8: '#8B5CF6', // Violet
        },
      },
      backgroundImage: {
        'aurora-boreal':
          'linear-gradient(135deg, #38BDF8 0%, #4ADE80 50%, #A78BFA 100%)',
        'spectra-glow': 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
