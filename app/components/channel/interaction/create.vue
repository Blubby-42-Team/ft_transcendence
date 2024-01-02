<script setup lang='ts'>

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	}
});

const input = ref("");

function search() {
	const userLoginName = input.value;
	input.value = "";
	if (userLoginName && userLoginName.length > 0) {
		console.log("searching for user: " + userLoginName);
		props.closeFunc();
	}
}

</script>

<template>
	<div class="w-[60vw] max-w-lg bg-background2 rounded-xl">
		<div class="grid grid-cols-2 gap-2 p-5 ">
			<input v-model="input" class="w-full h-16 col-span-2 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="Find a new channel" />
			<GenericButton class="h-16 px-5" :buttonStyle="1" >Save</GenericButton>
			<GenericButton class="h-16 px-5" :buttonStyle="1" @click="props.closeFunc">Exit</GenericButton>
		</div>
	</div>
</template>