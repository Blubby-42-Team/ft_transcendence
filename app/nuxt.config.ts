// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	experimental: {
		renderJsonPayloads: false
	},
	typescript: {
		strict: true
	},
	imports: {
		dirs: ['stores/**'],
	},
	devServer: {
		port: 4000,
	},
	devtools: { enabled: false },
	modules: [
		'@nuxtjs/tailwindcss',
		'@vueuse/nuxt',
		'@morev/vue-transitions/nuxt',
		['@pinia/nuxt', {
			autoImports: ['defineStore']
		}],
		'nuxt-icon',
	],
})
