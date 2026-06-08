import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--ink-20)",
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
        amber: "var(--amber)",
        red: "var(--red)"
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
