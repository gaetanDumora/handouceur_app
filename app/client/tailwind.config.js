/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [require('daisyui')],
  // daisyUI config (optional - here are the default values)
  daisyui: {
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
    themes: ["dark", {
      myTheme: {
        primary: "#a0c4ff",
        secondary: "#bdb2ff",
        accent: "#ffc6ff",
        neutral: "#fffffd",
        info: "#9bf6ff",
        success: "#caffbf",
        warning: "#fdffb6",
        error: "#ffadad"
      }
    }],
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    spacing: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
    }
  },
}

