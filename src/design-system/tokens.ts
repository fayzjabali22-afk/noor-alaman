/**
 * Noor Al-Amani Platform Design System Tokens (NATDS v1.0)
 * Compliant with NA-ADR Sovereign Guidelines:
 * - Sophisticated dark slate theme with emerald, teal, and amber accents
 * - Mathematical spacing scales and WCAG AA contrast compliance
 * - Non-cluttered, clean display typography and responsive card radii
 */

export const DESIGN_TOKENS = {
  colors: {
    bg: {
      primary: '#020617', // slate-950
      secondary: '#0f172a', // slate-900
      tertiary: '#1e293b', // slate-800
      accentGlow: 'rgba(16, 185, 129, 0.1)',
    },
    border: {
      subtle: 'rgba(51, 65, 85, 0.6)', // slate-700/60
      default: '#334155', // slate-700
      active: '#10b981', // emerald-500
      gold: '#f59e0b', // amber-500
      rose: '#f43f5e', // rose-500
    },
    text: {
      heading: '#f8fafc', // slate-50
      body: '#cbd5e1', // slate-300
      muted: '#94a3b8', // slate-400
      emerald: '#34d399', // emerald-400
      teal: '#2dd4bf', // teal-400
      amber: '#fbbf24', // amber-400
      indigo: '#818cf8', // indigo-400
      rose: '#fb7185', // rose-400
    },
    badge: {
      emerald: {
        bg: 'rgba(6, 78, 59, 0.5)',
        text: '#6ee7b7',
        border: 'rgba(16, 185, 129, 0.3)',
      },
      amber: {
        bg: 'rgba(120, 53, 15, 0.5)',
        text: '#fde047',
        border: 'rgba(245, 158, 11, 0.3)',
      },
      teal: {
        bg: 'rgba(19, 78, 74, 0.5)',
        text: '#5eead4',
        border: 'rgba(20, 184, 166, 0.3)',
      },
      indigo: {
        bg: 'rgba(49, 46, 129, 0.5)',
        text: '#a5b4fc',
        border: 'rgba(99, 102, 241, 0.3)',
      },
    },
  },
  typography: {
    fontFamily: "'Tajawal', 'Plus Jakarta Sans', system-ui, sans-serif",
    sizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
  },
  spacing: {
    cardPadding: '1.25rem', // 20px
    containerPadding: '1.5rem', // 24px
    gapDefault: '1rem', // 16px
  },
  radii: {
    card: '1rem', // 16px
    button: '0.75rem', // 12px
    badge: '9999px', // Pill
  },
  shadows: {
    subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.2)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
    glowEmerald: '0 0 15px -3px rgba(16, 185, 129, 0.25)',
  },
  transitions: {
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  humanitarianPolicy: {
    neutrality: 'Non-bias color pairing with clear, high-contrast legibility',
    accessibility: 'Passes WCAG AA ratio (>= 4.5:1 for body text)',
    noSponsoredHighlight: 'Equal visual weight across all publisher elements',
  },
};
