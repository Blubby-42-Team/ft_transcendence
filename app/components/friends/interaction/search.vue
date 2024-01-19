<script setup lang='ts'>

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	}
});

const { textarea, input } = useTextareaAutosize()
const { getUserByName } = useUserStore();

input.value = "";

const { addNotif } = useNotifStore();

async function search() {
	const userLoginName = input.value;
	input.value = "";
	if (userLoginName && userLoginName.length > 0) {
		// console.log("searching for user: " + userLoginName);
		const res = await getUserByName(userLoginName).catch(() => null);
		if (res){
			navigateTo("/profile/" + res);
		}
		else {
			addNotif("The user you are looking for does not exist");
		}
		props.closeFunc();
	}
}

</script>

<template>
	<div class="w-[60vw] max-w-lg bg-background2 rounded-xl">
		<div class=" p-5 grid grid-cols-[auto,3em] gap-2">
			<input v-model="input" class="w-full h-16 px-5 bg-background1 rounded-2xl text-text focus-border-none focus:ring-0" placeholder="Find a friend" />
			<GenericButton class="self-end w-10 h-10 mb-2" :buttonStyle="1"
				@click="search"
			>
				<Icon name="material-symbols:search" class="w-10 h-10"/>
			</GenericButton>
		</div>
	</div>
</template>