<script setup lang="ts">

const props = defineProps({
	userId: {
		type: Number as PropType<number>,
		required: true
	},
	isAdmin: {
		type: Boolean as PropType<boolean>,
		default: false,
	},
});

const { addNotif } = useNotifStore();

const { primaryUser, getUser, fetchUser, fetchHistory, getFriends, fetchFriends } = useUserStore();
const user = getUser(computed(() => props.userId));
const friend = getFriends(computed(() => primaryUser.value.id));
await fetchUser(props.userId);
await fetchHistory(props.userId);
await fetchFriends(primaryUser.value.id);

const channelStore = useChannelStore();
const { selectedChannel } = storeToRefs(channelStore);
selectedChannel.value?.admin.includes(props.userId);

const buttonList = computed(() => {
	const primaryIsAdmin = selectedChannel.value?.admin.includes(primaryUser.value.id) ?? false;
	const userIsAdmin = selectedChannel.value?.admin.includes(props.userId) ?? false;
	const isFriend = friend.value.includes(user.value.id);
	const isPrimaryUser = primaryUser.value.id === props.userId;
	return [
		{ type: 'bar',									condition: true, 								},
		{ type: 'button',	text: 'Profile',			condition: true, 												func: () => { navigateTo(`/profile/${props.userId}`) }, icon: 'material-symbols:person' },
		{ type: 'bar', 									condition: !isPrimaryUser,						},
		// { type: 'button',	text: 'Add to Friend',		condition: !isPrimaryUser && !isFriend,							func: async () => {
		// 	await fetchUserWhitelistPost(primaryUser.value.id, props.userId)
		// 		.then(() => {
		// 			addNotif("Invitation sent");
		// 		})
		// 		.catch((err) => {
		// 			console.warn("Error fetchUserWhitelistPost: ", err);
		// 			addNotif("User not found or already in your friend list");
		// 		});
		// }, icon: 'material-symbols:person-add' },
		{ type: 'button',	text: 'Block User',			condition: !isPrimaryUser, 										func: async () => {
			await fetchUserBlacklistPost(primaryUser.value.id, props.userId)
				.then(() => {
					addNotif("User blocked");
				})
				.catch((err) => {
					console.warn("Error fetchUserBlacklistPost: ", err);
					addNotif("User not found or already blocked");
				});
		}, icon: 'material-symbols:no-accounts' },
		{ type: 'button',	text: 'Invite to Lobby',	condition: !isPrimaryUser, 										func: async () => {
			navigateTo(`/lobby/custom`);
		}, icon: 'material-symbols:stadia-controller' },
		{ type: 'bar', 									condition: !isPrimaryUser && primaryIsAdmin,	},
		{ type: 'button',	text: 'Mute from channel',	condition: !isPrimaryUser && primaryIsAdmin,					func: async () => {
			await fetchMuteUser(primaryUser.value.id, props.userId, selectedChannel.value?.id ?? 0, 5)
				.then(() => {
					addNotif("User muted");
				})
				.catch((err) => {
					console.warn("Error fetchMuteUser: ", err);
					addNotif("User not found or already muted");
				});
		}, icon: 'material-symbols:voice-selection' },
		{ type: 'button',	text: 'Kick from channel',	condition: !isPrimaryUser && primaryIsAdmin,					func: async () => {
			await fetchRemoveFromChat(primaryUser.value.id, props.userId, selectedChannel.value?.id ?? 0)
				.catch((err) => {
					console.warn("Error fetchRemoveFromChat: ", err);
					addNotif("User not found or already kicked");
				});
		}, icon: 'material-symbols:group-remove' },
		{ type: 'button',	text: 'Ban from channel',	condition: !isPrimaryUser && primaryIsAdmin,					func: async () => {
			await fetchBanUser(primaryUser.value.id, props.userId, selectedChannel.value?.id ?? 0)
				.catch((err) => {
					console.warn("Error fetchBanUser: ", err);
					addNotif("User not found or already banned");
				});
		}, icon: 'material-symbols:group-off' },
		{ type: 'bar', 									condition: !isPrimaryUser && primaryIsAdmin,	},
		{ type: 'button',	text: 'Promote to admin',	condition: !isPrimaryUser && primaryIsAdmin && !userIsAdmin,	func: async () => {
			await fetchAddAdminChat(primaryUser.value.id, props.userId, selectedChannel.value?.id ?? 0)
				.catch((err) => {
					console.warn("Error fetchAddAdminChat: ", err);
					addNotif("User not found or already admin");
				});
		}, icon: 'material-symbols:stat-3' },
		{ type: 'button',	text: 'Demote',				condition: !isPrimaryUser && primaryIsAdmin && userIsAdmin,		func: async () => {
			await fetchRemoveAdminFromChat(primaryUser.value.id, props.userId, selectedChannel.value?.id ?? 0)
				.catch((err) => {
					console.warn("Error fetchRemoveAdminChat: ", err);
					addNotif("User not found or already admin");
				});
		}, icon: 'material-symbols:stat-minus-3' },
	] as Array<{
		type: 'button',
		condition: boolean,
		text: string,
		icon: string,
		func: () => void,
	} | {
		type: 'bar',
		condition: boolean
	}>
})

</script>

<template>
	<div class="flex flex-col w-full px-2 py-4 text-sm border-4 rounded-b-lg rounded-tl-lg shadow-lg border-color1 bg-background1 text-text">
		<GenericProfilePicture :imageSrc="user?.avatar ?? '/pp.png'" class="self-center w-32 h-32" :userId="props.userId"/>
		<div class="w-full p-2 mt-3 text-xl">{{ user.name }}</div>
		<template v-for="elem in buttonList">
			<template v-if="elem.condition">
				<template v-if="elem.type === 'button'">
					<button class="flex px-2 py-1 rounded cursor-pointer hover:bg-accent1 hover:text-text-dark"
						@click="elem.func"
					>
						<div class="w-5">
							<Icon :name="elem.icon" class="w-8 h-8"/>
						</div>
						<div class="self-center ml-4">{{ elem.text }}</div>
					</button>
				</template>
				<template v-else-if="elem.type === 'bar'">
					<hr class="my-3 border-text" />
				</template>
			</template>
		</template>
	</div>
</template>