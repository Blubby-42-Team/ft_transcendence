<script setup lang="ts">

definePageMeta({
	middleware: [
		async (to, from) => {
			const res = await fetchAuth(to.query?.code ?? '', async (res) => {
				console.log(res, res?.message?.requires2fa)
				await navigateTo('/login/2fa');
			});
		},
	],
});

</script>

<template>
	<div>
		<h1>Login</h1>
	</div>
</template>