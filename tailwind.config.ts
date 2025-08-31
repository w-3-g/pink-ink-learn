import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'manrope': ['Manrope', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				pink: {
					lightest: 'hsl(var(--pink-lightest))',
					lighter: 'hsl(var(--pink-lighter))',
					light: 'hsl(var(--pink-light))',
					medium: 'hsl(var(--pink-medium))',
					dark: 'hsl(var(--pink-dark))',
					darker: 'hsl(var(--pink-darker))',
					darkest: 'hsl(var(--pink-darkest))'
				}
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-glow': 'var(--gradient-glow)',
				'gradient-bg': 'var(--gradient-bg)'
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'elegant': 'var(--shadow-elegant)',
				'panel': 'var(--shadow-panel)'
			},
			animation: {
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-up-roll': 'slide-up-roll var(--animation-duration) var(--animation-easing) forwards',
				'pulse-glow': 'pulse-glow 2.5s infinite',
				'fade-in-slide-up': 'fade-in-slide-up 350ms var(--animation-easing) forwards',
				'particle-float': 'particle-float 20s linear infinite'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-up-roll': {
					'0%': { opacity: '1', transform: 'translateY(0) rotate(0)' },
					'70%': { transform: 'translateY(-70%) rotate(var(--roll-angle, 0deg))' },
					'100%': { opacity: '0', transform: 'translateY(-120%) rotate(var(--roll-angle, 0deg))' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 5px hsl(var(--pink-light) / 0.2), 0 0 10px hsl(var(--pink-light) / 0.1)' },
					'50%': { boxShadow: '0 0 15px hsl(var(--pink-light) / 0.4), 0 0 25px hsl(var(--pink-light) / 0.2)' }
				},
				'fade-in-slide-up': {
					'0%': { opacity: '0', transform: 'translateY(15px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'particle-float': {
					'0%': { transform: 'translateY(0px) rotate(0deg)' },
					'33%': { transform: 'translateY(-10px) rotate(120deg)' },
					'66%': { transform: 'translateY(5px) rotate(240deg)' },
					'100%': { transform: 'translateY(0px) rotate(360deg)' }
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
