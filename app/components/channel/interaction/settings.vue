<script setup lang='ts'>

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	},
});

const { selectedChannel, refreshChannel } = useChannelStore();
const { primaryUser, fetchUser } = useUserStore();

const channelName = ref(selectedChannel.value?.name);
const data = ref({
	selectedFile: null as File | null,
});

function edit() {
	console.log("Edit settings channel: " + selectedChannel.value?.id);
	props.closeFunc();
}

function handleFileChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
        data.value.selectedFile = event.target.files?.[0] || null;
    }
}

function uploadImage() {
    if (data.value.selectedFile) {
        const formData = new FormData();
        formData.append("file", data.value.selectedFile);
        console.log(formData.get("file"));
		changeChatPicture(primaryUser.value.id, selectedChannel.value?.id ?? 0, formData, () => {
			refreshChannel(primaryUser.value.id, selectedChannel.value?.id ?? 0);
		});
    }
}

</script>

<template>
	<div class="w-[30vw] max-w-lg bg-background2 rounded-xl text-text p-5">
		<div class="text-sm">
			<label class="p-2" for="avatar">Choose a profile picture</label>
			<input id="avatar" type="file" placeholder="test" @change="handleFileChange">
		</div>
		<GenericButton class="self-end w-10 h-10 mb-2" :buttonStyle="1"
			@click="uploadImage"
		>
			<Icon name="material-symbols:edit" class="w-10 h-10"/>
		</GenericButton>
	</div>
</template>