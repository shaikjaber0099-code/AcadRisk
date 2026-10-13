import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Nordic Slate & Frost Blue Design System Palette
        navy: {
          950: '#0B0F19', // Nordic Abyss (deepest background)
          900: '#0F172A', // Deep Slate Night (card base)
          850: '#141E33', // Dark Slate Surface
          800: '#1E293B', // Elevated Slate Surface
          750: '#26344B', // Slate Border / Highlight
          700: '#334155', // Slate Line / Divider
          600: '#475569', // Subtle Gray Slate
          500: '#64748B', // Muted Slate Text
        },
        portal: {
          navy: '#0B0F19',
          'navy-card': '#0F172A',
          'navy-muted': '#1E293B',
          primary: '#38BDF8', // Electric Frost Blue
          gold: '#38BDF8', // Frost Blue Accent
          goldMuted: 'rgba(56, 189, 248, 0.12)',
          goldBorder: 'rgba(56, 189, 248, 0.25)',
          goldHover: '#0EA5E9', // Ocean Sky
          offwhite: '#F8FAFC',
          crest: '#38BDF8',
          success: '#10B981', // Mint Emerald
          warning: '#F59E0B', // Nordic Amber
          danger: '#F43F5E', // Coral Rose
        },
        frost: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        brand: {
          indigo: '#38BDF8',
          violet: '#0284C7',
        },
        // Academic Engineering Branches (Nordic Department Signatures)
        branch: {
          cse: '#38BDF8',
          cseBg: 'rgba(56, 189, 248, 0.1)',
          cseBorder: 'rgba(56, 189, 248, 0.25)',
          aiml: '#818CF8',
          aimlBg: 'rgba(129, 140, 248, 0.1)',
          aimlBorder: 'rgba(129, 140, 248, 0.25)',
          ds: '#2DD4BF',
          dsBg: 'rgba(45, 212, 191, 0.1)',
          dsBorder: 'rgba(45, 212, 191, 0.25)',
          ece: '#60A5FA',
          eceBg: 'rgba(96, 165, 250, 0.1)',
          eceBorder: 'rgba(96, 165, 250, 0.25)',
          mech: '#94A3B8',
          mechBg: 'rgba(148, 163, 184, 0.1)',
          mechBorder: 'rgba(148, 163, 184, 0.25)',
        },
        // Semantic Supportive Risk States (Never Shaming, High Clarity)
        risk: {
          low: '#10B981',
          lowBg: 'rgba(16, 185, 129, 0.12)',
          lowBorder: 'rgba(16, 185, 129, 0.3)',
          medium: '#F59E0B',
          mediumBg: 'rgba(245, 158, 11, 0.12)',
          mediumBorder: 'rgba(245, 158, 11, 0.3)',
          high: '#F43F5E',
          highBg: 'rgba(244, 63, 94, 0.15)',
          highBorder: 'rgba(244, 63, 94, 0.35)',
        },
      },
      fontFamily: {
        // Normal clean standard sans font across the board as requested
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        serif: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        display: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['20px', { lineHeight: '28px' }],
        'xl': ['24px', { lineHeight: '32px' }],
        '2xl': ['32px', { lineHeight: '40px' }],
        '3xl': ['48px', { lineHeight: '56px' }],
        '4xl': ['64px', { lineHeight: '72px' }],
      },
      borderRadius: {
        'card': '16px',
        'control': '10px',
        'idcard': '18px',
        'full': '9999px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(11, 15, 25, 0.7)',
        'glow-primary': '0 0 24px -2px rgba(56, 189, 248, 0.3)',
        'glow-frost': '0 0 24px -2px rgba(56, 189, 248, 0.3)',
        'glow-gold': '0 0 20px -2px rgba(56, 189, 248, 0.25)',
        'glow-cse': '0 0 16px -2px rgba(56, 189, 248, 0.25)',
        'glow-aiml': '0 0 16px -2px rgba(129, 140, 248, 0.25)',
        'glow-ds': '0 0 16px -2px rgba(45, 212, 191, 0.25)',
        'glow-ece': '0 0 16px -2px rgba(96, 165, 250, 0.25)',
        'glow-mech': '0 0 16px -2px rgba(148, 163, 184, 0.25)',
      },
      transitionDuration: {
        instant: '90ms',
        fast: '160ms',
        base: '240ms',
        slow: '420ms',
        cinematic: '700ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0, 1)',
        emphasized: 'cubic-bezier(0.3, 0, 0, 1.2)',
        exit: 'cubic-bezier(0.4, 0, 1, 1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shine-sweep': 'shineStreak 2.4s ease-in-out infinite',
      },
      keyframes: {
        shineStreak: {
          '0%': { transform: 'translateX(-100%) rotate(30deg)' },
          '100%': { transform: 'translateX(250%) rotate(30deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
