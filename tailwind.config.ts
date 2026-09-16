import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        glitch: {
          magenta: "#FF2E93",
          lime: "#C6FF3D",
          blue: "#3D7EFF",
          lavender: "#C9A9FF",
          yellow: "#FFE600",
          cyan: "#00F0FF",
          dark: "#12081C",
          darker: "#0B0412",
          card: "#1D112B",
          cardLight: "#FFFFFF",
          border: "#34224A",
          borderLight: "#000000",
          muted: "#9E8CB2",
        },
        studio: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
          950: "#12081C",
        },
        pastel: {
          coral: {
            DEFAULT: "#FFB4A2",
            light: "#FFF0EC",
            hover: "#FFA08B",
            deep: "#FF7B60",
          },
          yellow: {
            DEFAULT: "#FFE066",
            light: "#FFF9DB",
            hover: "#FFD633",
            deep: "#E5BE1A",
          },
          lavender: {
            DEFAULT: "#C8B6FF",
            light: "#F3EEFF",
            hover: "#B69DFE",
            deep: "#9775FA",
          },
          mint: {
            DEFAULT: "#B8F2E6",
            light: "#EAFBF7",
            hover: "#9EEBD9",
            deep: "#63D2B8",
          },
          peach: {
            DEFAULT: "#FFD8BE",
            light: "#FFF5EE",
            hover: "#FFCAAA",
          },
          cream: "#FAF8F5",
          sand: "#F4EFEA",
        },
      },
      fontFamily: {
        display: ["var(--font-fredoka)", "Fredoka", "Plus Jakarta Sans", "sans-serif"],
        sans: ["var(--font-fredoka)", "Fredoka", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "Space Mono", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "2xl": "0.875rem",
        "3xl": "1.25rem",
        "4xl": "1.75rem",
        "5xl": "2.25rem",
      },
      animation: {
        "marquee": "marquee 26s linear infinite",
        "marquee-reverse": "marqueeReverse 26s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 3s infinite linear",
        "pulse-glow": "pulseGlow 2s infinite ease-in-out",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-6px) rotate(1deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.03)" },
        },
      },
      boxShadow: {
        "sticker": "3px 3px 0px #000000",
        "sticker-lg": "5px 5px 0px #000000",
        "sticker-xl": "8px 8px 0px #000000",
        "sticker-pink": "4px 4px 0px #FF2E93",
        "sticker-lime": "4px 4px 0px #C6FF3D",
        "sticker-blue": "4px 4px 0px #3D7EFF",
        "dark-sticker": "3px 3px 0px #FF2E93",
        "dark-sticker-lg": "5px 5px 0px #C6FF3D",
        "foil": "0 0 25px rgba(201, 169, 255, 0.45), inset 0 0 15px rgba(255, 46, 147, 0.25)",
        "holo": "0 0 35px rgba(198, 255, 61, 0.35)",
        "soft": "0 2px 10px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.02)",
        "elevated": "0 12px 32px -4px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        "card": "0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
};

export default config;
