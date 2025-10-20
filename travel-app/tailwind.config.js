/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern Nepali Travel Website - Himalayan Theme (Top to Bottom Structure)
        
        // Navbar Colors
        'navbar-white': 'rgba(255, 255, 255, 0.9)',  // Semi-transparent white with blur
        'navbar-highlight': '#3A86FF',                // Blue highlight for active links
        
        // Hero Section Colors
        'hero-overlay-dark': '#0B132B',               // Dark navy overlay start
        'hero-overlay-transparent': 'transparent',    // Overlay end
        'hero-accent-gold': '#FDCB6E',               // Golden-yellow heading accents (sunrise)
        
        // Search Section Colors
        'search-glass': 'rgba(255, 255, 255, 0.1)',  // Glassmorphism background
        'search-border': 'rgba(255, 255, 255, 0.2)', // Soft glass borders
        
        // Body Section Colors
        'body-bg': '#F8F9FA',                        // Light, airy off-white background
        'card-white': '#FFFFFF',                     // White cards
        'forest-green': '#1B4332',                   // Primary accent - forest green
        'sky-blue': '#3A86FF',                       // Primary accent - sky blue
        'bright-teal': '#00B4D8',                    // Gradient end for buttons
        
        // Text Colors
        'text-header': '#1E293B',                    // Dark slate gray for headers
        'text-body': '#475569',                      // Muted gray for paragraphs
        
        // Footer Colors
        'footer-everest': '#1E3A5F',                 // Calming Everest blue-gray
        'footer-highlight': '#3A86FF',               // Blue highlights in footer
        
        // Keep existing primary/secondary for compatibility
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      backgroundImage: {
        'gradient-search-button': 'linear-gradient(90deg, #3A86FF, #00B4D8)',
        'gradient-hero-overlay': 'linear-gradient(to bottom, #0B132B, transparent)',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'sans-serif'],
        nepali: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideInRight': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}