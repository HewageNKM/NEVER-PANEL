import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        primary:"rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;"
      },
      colors: {
        'primary-50':'#F0F9E8',
        'primary-100':'#97E13E',
        'primary-200':'#7CAB3D',
        'primary-300':'#6B903B',
        'primary-400':'#5A7539',
      }
    },
  },
  plugins: [],
};
export default config;
