<script setup lang='ts'>

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	},
});

const { selectedChannel } = useChannelStore();

const channelName = ref(selectedChannel.value?.name);

function edit() {
	console.log("Edit settings channel: " + selectedChannel.value?.id);
	props.closeFunc();
}

</script>

<template>
	<div class="w-[30vw] max-w-lg bg-background2 rounded-xl text-text">
		<div class="grid grid-cols-2 gap-2 p-5 ">
			<input v-model="channelName" class="w-full h-16 col-span-2 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="Channel Name" />
			<GenericButton class="h-16 px-5" :buttonStyle="1" @click="edit">Save</GenericButton>
			<GenericButton class="h-16 px-5" :buttonStyle="1" @click="props.closeFunc">Exit</GenericButton>
		</div>
	</div>
</template>