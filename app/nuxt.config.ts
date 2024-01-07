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
		port: 3000,
	},
	devtools: { enabled: false },
	modules: [
		'@nuxtjs/tailwindcss',
		'@vueuse/nuxt',
		'@morev/vue-transitions/nuxt',
		['@pinia/nuxt', {
			autoImports: ['defineStore', 'storeToRefs']
		}],
		'nuxt-icon',
	],
	runtimeConfig: {
		back: {
			uri: 'http://localhost:3000',
		},
		public: {
			back: {
				uri: 'http://localhost:3000',
				auth: 'http://localhost:3000/auth/login42',
			},
		}
	},
})
