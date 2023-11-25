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
