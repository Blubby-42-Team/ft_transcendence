import { createThemes } from 'tw-colors'

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./node_modules/tw-elements/dist/js/**/*.js',
		'./**/*.vue',
		'./**/*.ts',
		'./**/*.svg',
	],
	theme: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('tailwind-scrollbar')({ nocompatible: true }),
		require('flowbite/plugin'),
		require('tw-elements/dist/plugin.cjs'),
		createThemes({
			'theme-dark-blue': {
				'text':				'#f7f4ed',
				'text-dark':		'#120f08',
				'text-light':		'#f7f4ed',
				'background1':		'#070A0F',
				'background2':		'#081326',
				'background3':		'#111827',
				'color1':			'#0F2F69',
				'color2':			'#181f2e',
				'color3':			'#2F4F8E',
				'accent-color':		'#FFB900',
				'liveGameColor':	'#DC1B1B',
			},
			'theme-light-blue': {
				'text':				'#120f08',
				'text-dark':		'#120f08',
				'text-light':		'#f7f4ed',
				'background1':		'#F1F4F8',
				'background2':		'#C0CEE8',
				'background3':		'#111827',
				'color1':			'#94B4F0',
				'color2':			'#BCCAE6',
				'color3':			'#7191D0',
				'accent-color':		'#B58C1D',
				'liveGameColor':	'#DC1B1B',
			},
			'theme-dark': {
				'text':				'#FFFFFF',
				'text-dark':		'#000000',
				'text-light':		'#FFFFFF',
				'accent-color':		'#ECBC42',
				'primary-color':	'#2F356D',
				'background1':		'#333641',
				'background2':		'#121317',
				'liveGameColor':	'#DC1B1B',
			},
			'theme-light': {
				'text':				'#000000',
				'text-dark':		'#000000',
				'text-light':		'#FFFFFF',
				'accent-color':		'#ECBC42',
				'primary-color':	'#2F356D',
				'background1':		'#FFFFFF',
				'background2':		'#E4E4E4',
				'liveGameColor':	'#DC1B1B',
			},
		}),
	],
}
