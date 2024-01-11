<script setup lang='ts'>

const props = defineProps({
	closeFunc: {
		type: Function as PropType<() => void>,
		required: true
	},
});

const { addNotif } = useNotifStore();
const { getUser, fetchUser, getFriends, fetchFriends, primaryUser } = useUserStore();

const friends = getFriends(computed(() => primaryUser.value.id));
await fetchFriends(primaryUser.value.id);

const selectedUser = ref(0);
const user = getUser(selectedUser);
await fetchUser(selectedUser.value);

async function invite() {
	props.closeFunc();
}

</script>

<template>
	<div class="w-[30vw] max-w-lg bg-background2 rounded-xl text-text">
		<div class="grid grid-cols-2 gap-2 p-5 ">
			<div class="grid grid-cols-[4em_auto] col-span-2 grid-rows-[4em]">
				<template v-for="friend in friends">
					<ChannelInteractionAddFriendsUtils :userId="friend"
						:isSelected="selectedUser === friend"
						@click="selectedUser = friend"
					/>
				</template>
			</div>
			<template v-if="selectedUser !== 0">
				<div class="col-span-2 text-center">Are you sure you want to invite {{ user.name }} to this lobby ?</div>
				<GenericButton class="self-end w-10 h-10 mb-2 ml-auto" :buttonStyle="1" @click="invite">Yes</GenericButton>
				<GenericButton class="self-end w-10 h-10 mb-2" :buttonStyle="1" @click="props.closeFunc">No</GenericButton>
			</template>
		</div>
	</div>
</template>