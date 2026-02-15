/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: '#818cf8', // Soft Indigo 400
                secondary: '#a78bfa', // Soft Violet 400
                accent: '#fbbf24', // Amber 400
                dark: '#1e293b', // Slate 800 (Softer dark)
                light: '#f8fafc', // Slate 50
                success: '#34d399', // Emerald 400
                danger: '#f87171', // Red 400
                warning: '#fbbf24', // Amber 400
                info: '#60a5fa' // Blue 400
            },
            animation: {
                'blob': 'blob 7s infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                }
            }
        },
    },
    plugins: [],
}
