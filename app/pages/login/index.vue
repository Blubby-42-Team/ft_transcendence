<script setup lang="ts">

definePageMeta({
	layout: false,
	middleware: 'login',
});

const code = ref('');
const errorMsg = ref('');

async function submit(){
	const newCode = code.value;
	code.value = '';

	await fetchSubmitCode(newCode, (res) => {
		if (res.statusCode === 200){
			navigateTo('/');
		}
		else {
			errorMsg.value = res.message;
		}
		console.log(res);
	});
}

</script>

<template>
	<div class="h-full p-40 bg-background2">
		<div class="grid grid-cols-[auto,3rem]">
			<input v-model="code" class="w-full h-16 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="Insert Auth Code" />
			<GenericButton class="w-10 h-10 m-2" :buttonStyle="1"
				@click="submit"
			>
				<Icon name="material-symbols:send" class="w-10 h-10"/>
			</GenericButton>
		</div>
		<div class="text-5xl">{{ errorMsg }}</div>
	</div>
</template>