import type { Config } from "tailwindcss";

// Цвета точно из design-v0/app/globals.css, прямые oklch-значения.
// Tailwind 3.4.14 поддерживает oklch() нативно.
const dv0 = {
  background:   "oklch(0.975 0.002 90)",   // тёплый пергамент
  foreground:   "oklch(0.18  0.02  45)",   // тёмно-коричневый
  card:         "oklch(0.99  0.001 90)",   // почти белый
  primary:      "oklch(0.35  0.06  250)",  // тёмно-синий/индиго
  primaryFg:    "oklch(0.98  0     0)",    // белый
  primaryHover: "oklch(0.42  0.07  250)",  // синий hover
  secondary:    "oklch(0.94  0.01  90)",   // светло-бежевый
  secondaryFg:  "oklch(0.25  0.02  45)",
  muted:        "oklch(0.92  0.01  90)",   // приглушённый фон
  mutedFg:      "oklch(0.45  0.02  45)",   // серо-коричневый
  accent:       "oklch(0.40  0.08  45)",   // терракот / значки
  accentFg:     "oklch(0.98  0     0)",
  border:       "oklch(0.88  0.01  90)",   // тёплая граница
  input:        "oklch(0.92  0.01  90)",
  // Навигация: используем primary как базовый тёмный цвет
  navBg:        "oklch(0.35  0.06  250)",  // = primary (тёмно-синий)
  navBar:       "oklch(0.40  0.065 250)",  // чуть светлее
  navText:      "oklch(0.98  0     0)",    // белый текст на тёмном фоне
} as const;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Канонические токены (соответствуют design-v0)
        background:   dv0.background,
        foreground:   dv0.foreground,
        card:         { DEFAULT: dv0.card, foreground: dv0.foreground },
        primary:      { DEFAULT: dv0.primary, foreground: dv0.primaryFg, hover: dv0.primaryHover },
        // В компонентах secondary используется как акцентный/badge цвет → accent из design-v0
        secondary:    { DEFAULT: dv0.accent, foreground: dv0.accentFg },
        muted:        { DEFAULT: dv0.muted, foreground: dv0.mutedFg },
        accent:       { DEFAULT: dv0.accent, foreground: dv0.accentFg },
        border:       dv0.border,
        input:        dv0.input,
        ring:         dv0.primary,

        // Псевдонимы, которые используются в компонентах сайта
        bg:           dv0.background,          // bg-bg
        surface:      dv0.card,                // bg-surface
        text: {
          DEFAULT: dv0.foreground,             // text-text
          muted:   dv0.mutedFg,               // text-text-muted
        },
        nav: {
          bg:   dv0.navBg,                    // bg-nav-bg
          bar:  dv0.navBar,                   // bg-nav-bar
          text: dv0.navText,                  // text-nav-text
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "var(--font-noto)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        sm:  "0.25rem",
        md:  "0.3125rem",
        lg:  "0.375rem",
        xl:  "0.625rem",
        "2xl": "0.75rem",
        full: "9999px",
      },
      maxWidth: {
        site: "1280px",
      },
      boxShadow: {
        card:       "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.12)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
