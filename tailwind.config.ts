import { type Config } from "tailwindcss";

/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
} satisfies Config;
