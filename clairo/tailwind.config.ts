import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        base: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        overlay: 'var(--bg-overlay)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          light: 'var(--accent-light)',
          text: 'var(--accent-text)',
        },
        success: { DEFAULT: 'var(--success)', light: 'var(--success-light)' },
        warning: { DEFAULT: 'var(--warning)', light: 'var(--warning-light)' },
        danger: { DEFAULT: 'var(--danger)', light: 'var(--danger-light)' },
        info: { DEFAULT: 'var(--info)', light: 'var(--info-light)' },
      },
      borderColor: {
        DEFAULT: 'var(--border)',
        strong: 'var(--border-strong)',
        accent: 'var(--border-accent)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        accent: 'var(--shadow-accent)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      transitionTimingFunction: {
        clairo: 'var(--ease)',
      },
      fontSize: {
        micro: '10px',
        caption: '12px',
        'secondary-ui': '13px',
        body: '15px',
        'body-lg': '17px',
        'card-title': '20px',
        'section-heading': '24px',
        'page-title': '32px',
        hero: '48px',
        display: '64px',
      },
    },
  },
  plugins: [],
};
export default config;
