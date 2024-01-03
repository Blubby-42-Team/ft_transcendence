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
			'utils/**',
		],
	},
	devServer: {
		port: 4001,
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
				uri: 'ws://localhost:3000',
				ws: 'ws://localhost:3000',
			},
		}
	},
})
