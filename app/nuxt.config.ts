// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	experimental: {
		renderJsonPayloads: false
	},
	typescript: {
		strict: true
	},
	imports: {
		dirs: [
			'stores/**',
			'../libs/types/**',
			'../libs/types/game/**',
			'../libs/game/**',
		],
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
	runtimeConfig: {
		public: {
			back: {
				uri: 'http://localhost:3000', // can be overridden by NUXT_API_SECRET environment variable
			}
		}
	},
})
