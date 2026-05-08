import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neubrutalism Palette
        "nb-yellow": "#ffdf6b",
        "nb-orange": "#ff5c00",
        "nb-purple": "#7300ff",
        "nb-blue": "#00c1ff",
        "nb-pink": "#ff00e5",
        "nb-green": "#00ff85",
        "nb-cream": "#fef6e4",
        "nb-black": "#000000",
        "nb-white": "#ffffff",
        
        // Mapping existing names to Neubrutalism for easier transition if needed
        primary: "#ff5c00",
        secondary: "#00c1ff",
        background: "#fef6e4",
        surface: "#ffffff",
        ink: "#000000",
        inkSoft: "#333333",
        
        primarySoft: '#ff8540',
        danger: '#ff0000',
        dangerSoft: '#ffcccc',
        surfaceLow: '#fef6e4',
        surfaceHigh: '#ffffff',
        surfaceLowest: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        headline: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        'nb': '4px 4px 0px 0px rgba(0,0,0,1)',
        'nb-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'nb-hover': '2px 2px 0px 0px rgba(0,0,0,1)',
        civic: '4px 4px 0px 0px rgba(0,0,0,1)', // Overriding old shadow
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        civic: '0px',
      },
    },
  },
  plugins: [
    forms,
    containerQueries,
  ],
} satisfies Config
