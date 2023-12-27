declare module 'nuxt/schema' {
	interface RuntimeConfig {
	}
	interface PublicRuntimeConfig {
		public: {
			back: {
				uri: string
			},
		},
	}
}
// It is always important to ensure you import/export something when augmenting a type
export {}