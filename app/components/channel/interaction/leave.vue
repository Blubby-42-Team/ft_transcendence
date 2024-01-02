<script setup lang='ts'>

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	},
});

const { selectedChannel } = useChannelStore();

function leave() {
	console.log("Leaving channel: " + selectedChannel.value?.id);
	props.closeFunc();
}

</script>

<template>
	<div class="w-[30vw] max-w-lg bg-background2 rounded-xl  text-text">
		<div class="grid grid-cols-2 gap-2 p-5 ">
			<div class="col-span-2 text-center">Are you sure you want to leave {{ selectedChannel?.name }} ?</div>
			<GenericButton class="self-end w-10 h-10 mb-2 ml-auto" :buttonStyle="1" @click="leave">Yes</GenericButton>
			<GenericButton class="self-end w-10 h-10 mb-2" :buttonStyle="1" @click="props.closeFunc">No</GenericButton>
		</div>
	</div>
</template>