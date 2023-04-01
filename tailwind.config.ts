import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0d1117",
        accent: {
          primary: "#00888F",
          secondary: "#7ee787",
        },
        canvas: {
          subtle: "#161b22",
        },
      
        muted: {
          default:'#30363d',
          fg: "#7a8490"
        }
      },
      fontFamily: {
        body: "Poppins",
      },
    },
  },
  plugins: [],
} as Config;
