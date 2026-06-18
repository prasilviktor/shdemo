import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm paper backgrounds
        paper: "#FAF8F5",
        "paper-2": "#F3F0EB",
        surface: "#FFFFFF",
        "surface-2": "#F0EDE8",
        // Borders
        line: "#E5E0D8",
        "line-2": "#D4CFC6",
        // Text
        ink: "#2C2820",
        "ink-2": "#5C564F",
        "ink-3": "#767068",
        // Sage (primary accent)
        sage: "#4A7C5A",
        "sage-d": "#33603F",
        "sage-l": "#EBF2EC",
        "sage-bd": "#A8C9B5",
        // Amber (pending / warning states)
        amber: "#92600A",
        "amber-l": "#FBF4E8",
        "amber-bd": "#F5C97B",
        // Peach (urgent / attention)
        peach: "#C0532F",
        "peach-l": "#FBEEE8",
        "peach-bd": "#F0C8B8",
        // Sky (informational)
        sky: "#2D6A9F",
        "sky-l": "#E6F1FB",
        "sky-bd": "#9DCAEB",
      },
      fontFamily: {
        serif: ["Lora", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1rem",
        xl3: "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(44,40,32,0.04), 0 4px 16px rgba(44,40,32,0.04)",
        "soft-lg": "0 4px 24px rgba(44,40,32,0.07)",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
