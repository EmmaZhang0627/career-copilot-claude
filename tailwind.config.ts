import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1120px"
      }
    },
    extend: {
      colors: {
        border: "var(--ink-20)",
        input: "var(--ink-20)",
        ring: "var(--teal-500)",
        background: "var(--white)",
        foreground: "var(--ink)",
        ink: {
          DEFAULT: "var(--ink)",
          60: "var(--ink-60)",
          20: "var(--ink-20)"
        },
        teal: {
          900: "var(--teal-900)",
          800: "var(--teal-800)",
          700: "var(--teal-700)",
          500: "var(--teal-500)",
          300: "var(--teal-300)",
          100: "var(--teal-100)",
          50: "var(--teal-50)"
        },
        white: "var(--white)",
        amber: {
          DEFAULT: "var(--amber)"
        },
        red: {
          DEFAULT: "var(--red)"
        },
        primary: {
          DEFAULT: "var(--teal-700)",
          foreground: "var(--white)",
          medium: "var(--teal-500)",
          light: "var(--teal-50)"
        },
        secondary: {
          DEFAULT: "var(--teal-50)",
          foreground: "var(--ink)"
        },
        muted: {
          DEFAULT: "var(--teal-50)",
          foreground: "var(--ink-60)"
        },
        accent: {
          DEFAULT: "var(--teal-50)",
          foreground: "var(--teal-700)"
        },
        card: {
          DEFAULT: "var(--white)",
          foreground: "var(--ink)"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"]
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
