/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#14532D",
          50: "#F0FDF4",
          100: "#DCFCE7",
          600: "#166534",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
          950: "#052E16",
        },
        secondary: "#DCFCE7",
        accent: {
          DEFAULT: "#D4AF37",
          light: "#E7C86B",
          dark: "#A8861F",
        },
        ink: "#1F2937",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ['"Playfair Display"', "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 18px 50px -24px rgba(20, 83, 45, 0.35)",
        card: "0 12px 30px -18px rgba(15, 23, 42, 0.35)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
        "fade-in": "fadeIn 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
