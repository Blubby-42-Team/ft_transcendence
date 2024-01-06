<script setup lang="ts">


definePageMeta({
	layout: false,
	middleware: 'login',
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