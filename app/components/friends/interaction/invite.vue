<script setup lang='ts'>

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	}
});

const { textarea, input } = useTextareaAutosize()

input.value = "";

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
	<div class="w-[30vw] max-w-lg bg-background2 rounded-xl">
		<div class="grid grid-cols-2 gap-2 p-5 ">
			<div class="col-span-2 text-center">Are you sure you want to invite this user to play ?</div>
			<GenericButton class="self-end w-10 h-10 mb-2 ml-auto" :buttonStyle="1" @click="search">Yes</GenericButton>
			<GenericButton class="self-end w-10 h-10 mb-2" :buttonStyle="1" @click="props.closeFunc">No</GenericButton>
		</div>
	</div>
</template>