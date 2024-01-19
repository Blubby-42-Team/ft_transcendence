<script setup lang='ts'>

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	},
});

const channelStore = useChannelStore();
const { selectedChannel } = storeToRefs(channelStore);
const { refreshChannel, fetchChannelList } = channelStore;
const { primaryUser, fetchUser } = useUserStore();
const { input } = useTextareaAutosize()

const channelName = ref(selectedChannel.value?.name);
const data = ref({
	selectedFile: null as File | null,
});

function edit() {
	// console.log("Edit settings channel: " + selectedChannel.value?.id);
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
        // console.log(formData.get("file"));
		changeChatPicture(primaryUser.value.id, selectedChannel.value?.id ?? 0, formData, () => {
			refreshChannel(primaryUser.value.id, selectedChannel.value?.id ?? 0);
			fetchChannelList(primaryUser.value.id);
		});
    }
	props.closeFunc();
}

function changeType(){
	if (selectedChannel.value?.type === "public"){
		const password = input.value;
		input.value = "";
		fetchChangeChatType(primaryUser.value.id, selectedChannel.value?.id ?? 0, password, () => {
			refreshChannel(primaryUser.value.id, selectedChannel.value?.id ?? 0);
			fetchChannelList(primaryUser.value.id);
		})
	}
	else if (selectedChannel.value?.type === "protected"){
		fetchChangeChatType(primaryUser.value.id, selectedChannel.value?.id ?? 0, "default", () => {
			refreshChannel(primaryUser.value.id, selectedChannel.value?.id ?? 0);
			fetchChannelList(primaryUser.value.id);
		})
	}
	props.closeFunc();
}

</script>

<template>
	<div class="w-[50vw] grid grid-cols-[auto,4em] max-w-lg bg-background2 rounded-xl text-text p-5">
		<div class="">
			<label class="p-2" for="avatar">Choose a profile picture</label>
			<input id="avatar" type="file" placeholder="test" @change="handleFileChange">
		</div>
		<GenericButton class="self-end w-10 h-10 mb-10" :buttonStyle="1"
			@click="uploadImage"
		>
			<Icon name="material-symbols:edit" class="w-10 h-10"/>
		</GenericButton>

		<GenericButton class="self-end w-full h-10 col-span-2 mb-2" :buttonStyle="1"
			@click="changeType"
		>
			{{ selectedChannel?.type === 'protected' ? 'Deactivate Password' : 'Activate Password' }}
		</GenericButton>
		<template v-if="selectedChannel?.type === 'public'">
			<input type="password" v-model="input" class="w-full h-16 col-span-2 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="Password" />
		</template>
	</div>
</template>