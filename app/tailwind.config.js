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
			'theme-dark': {
				'text':				'#FFFFFF',
				'text-dark':		'#000000',
				'text-light':		'#FFFFFF',
				'accent1':			'#ECBC42',
				'accent2':			'#876100',
				'color1':			'#2F356D',
				'color2':			'#535CB1',
				'color3':			'#0D1027',
				'background1':		'#2b2d31',
				'background2':		'#383a40',
				'liveGame':			'#DC1B1B',

			},	
			'theme-light': {
				'text':				'#000000',
				'text-dark':		'#000000',
				'text-light':		'#FFFFFF',
				'accent1':			'#ECBC42',
				'accent2':			'#876100',
				'color1':			'#2F356D',
				'color2':			'#535CB1',
				'color3':			'#0D1027',
				'background1':		'#FFFFFF',
				'background2':		'#E4E4E4',
				'liveGame':			'#DC1B1B',
			},
		}),
	],
}
