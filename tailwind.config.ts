export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Inter"', 'sans-serif'],
        },
        borderRadius: {
          xl: '1rem',
          '2xl': '1.5rem',
        },
        boxShadow: {
          soft: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    plugins: [],
  };
  