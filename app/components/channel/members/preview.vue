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

const { primaryUser, getUser, fetchUser, fetchHistory,getFriends } = useUserStore();
const user = getUser(computed(() => props.userId));
const friend = getFriends(computed(() => props.userId));
await fetchUser(props.userId);
await fetchHistory(props.userId);

const { selectedChannel } = useChannelStore();
selectedChannel.value?.admin.includes(props.userId);

const buttonList = computed(() => {
	const primaryIsAdmin = selectedChannel.value?.admin.includes(primaryUser.value.id) ?? false;
	const userIsAdmin = selectedChannel.value?.admin.includes(props.userId) ?? false;
	const isFriend = friend.value.includes(user.value.id);
	const isPrimaryUser = primaryUser.value.id === props.userId;
	return [
		{ type: 'bar',									condition: true 												},
		{ type: 'button',	text: 'Profile',			condition: true, 												icon: 'material-symbols:person' },
		{ type: 'bar', 									condition: !isPrimaryUser,										},
		{ type: 'button',	text: 'Add to Friend',		condition: !isPrimaryUser && !isFriend,							icon: 'material-symbols:person-add' },
		{ type: 'button',	text: 'Block User',			condition: !isPrimaryUser, 										icon: 'material-symbols:no-accounts' },
		{ type: 'button',	text: 'Invite to Lobby',	condition: !isPrimaryUser, 										icon: 'material-symbols:stadia-controller' },
		{ type: 'bar', 									condition: !isPrimaryUser && primaryIsAdmin,					},
		{ type: 'button',	text: 'Mute from channel',	condition: !isPrimaryUser && primaryIsAdmin,					icon: 'material-symbols:voice-selection' },
		{ type: 'button',	text: 'Kick from channel',	condition: !isPrimaryUser && primaryIsAdmin,					icon: 'material-symbols:group-remove' },
		{ type: 'button',	text: 'Ban from channel',	condition: !isPrimaryUser && primaryIsAdmin,					icon: 'material-symbols:group-off' },
		{ type: 'bar', 									condition: !isPrimaryUser && primaryIsAdmin,					},
		{ type: 'button',	text: 'Promote to admin',	condition: !isPrimaryUser && primaryIsAdmin && !userIsAdmin,	icon: 'material-symbols:stat-3' },
		{ type: 'button',	text: 'Demote',				condition: !isPrimaryUser && primaryIsAdmin && userIsAdmin,		icon: 'material-symbols:stat-minus-3' },
	] as Array<{
		type: 'button',
		condition: boolean,
		text: string,
		icon: string
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
					<button class="flex px-2 py-1 rounded cursor-pointer hover:bg-accent1 hover:text-text-dark">
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