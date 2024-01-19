<script setup lang='ts'>

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	},
	userId: {
		type: Number as PropType<number>,
		required: true
	},
});

const { addNotif } = useNotifStore();
const { getUser, fetchUser, primaryUser } = useUserStore();
const user = getUser(computed(() => props.userId));
await fetchUser(props.userId);

async function block() {
	await fetchUserBlacklistDelete(primaryUser.value.id, props.userId)
		.then(() => {
			addNotif("User unblocked");
		})
		.catch((err) => {
			console.warn("Error fetchUserBlacklistDelete: ", err);
			addNotif("User not found or already unblocked");
		});
	props.closeFunc();
}


</script>

<template>
	<div class="w-[30vw] max-w-lg bg-background2 rounded-xl text-text">
		<div class="grid grid-cols-2 gap-2 p-5 ">
			<div class="col-span-2 text-center">Are you sure you want to unblock {{ user.name }} as your friend ?</div>
			<GenericButton class="self-end w-10 h-10 mb-2 ml-auto" :buttonStyle="1" @click="block">Yes</GenericButton>
			<GenericButton class="self-end w-10 h-10 mb-2" :buttonStyle="1" @click="props.closeFunc">No</GenericButton>
		</div>
	</div>
</template>