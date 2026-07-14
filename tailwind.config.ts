import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0d1e",
        "ink-deep": "#090a18",
        accent: "#dcef66",
        "accent-soft": "#deef66",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        card: "32px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
