<script setup lang="ts">

definePageMeta({
	layout: false,
	middleware: [
		async (to, from) => {
			// if (process.client){
				console.log('XDD')
				const code = to.query.code;
				if (code && typeof code === 'string'){
					const res = await fetchAuth(code);
					console.log(typeof res.data.value?.message.requires2fa)
					if (res.data.value?.message.requires2fa){
						// await navigateTo('/login/2fa');
					}
					else {
						// await navigateTo('/'); // Infinite loop if cookie is not set which is the case for now
					}
				}
			// }
		},
	],
});

// import { useQRCode } from '@vueuse'

// const text = ref('text-to-encode')
// const qrcode = useQRCode(text)
</script>

<template>
	<div>
		<h1>Login</h1>
		<!-- <input v-model="text" type="text" />
		<img :src="qrcode" alt="QR Code" /> -->
	</div>
</template>