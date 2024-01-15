<script setup lang='ts'>

const { textarea, input } = useTextareaAutosize()

const userStore = useUserStore();
const { primaryUser } = storeToRefs(userStore);

const { addNotif } = useNotifStore();


const props = defineProps({
	close: {
		type: Function as PropType<() => void>,
		required: true
	},
});

const data = ref({
    selectedFile: null as File | null,
});
const newName = ref("");

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
		changeUserPicture(primaryUser.value.id, formData, () => {
			userStore.fetchUser(primaryUser.value.id);
		});
    }
}

async function changeName(){
	const name = newName.value;
	newName.value = "";
	if (name && name.length > 0){
		const res = await fetchChangeDisplayName(primaryUser.value.id, name, () => {
			userStore.fetchUser(primaryUser.value.id);
		});
		if (res.data.value !== "ok"){
			addNotif("Could not change name");;
		}
	}
}

</script>

<template>
	<div class="w-[60vw] max-w-lg bg-background2 rounded-xl text-text">
		<div class=" p-5 grid grid-cols-[auto,3em] gap-2">
			<div class="pt-2 pb-1 pl-2 pr-0 bg-background1 rounded-2xl">
				<input v-model="newName" class="w-full h-16 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="New Name" />
			</div>
			<GenericButton class="self-end w-10 h-10 mb-2" :buttonStyle="1"
				@click="changeName"
			>
				<Icon name="material-symbols:edit" class="w-10 h-10"/>
			</GenericButton>
			<div class="col-span-2 my-5 border-t-2 border-text"></div>
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
	</div>
</template>