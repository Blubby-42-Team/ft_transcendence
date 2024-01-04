<script setup lang="ts">

const props = defineProps({
	userId: {
		type: Number as PropType<number>,
		required: true
	}
});

const { getUser, fetchUser, fetchHistory } = useUserStore();
const user = getUser(computed(() => props.userId));
await fetchUser(props.userId);
await fetchHistory(props.userId);

const test: Ref<Array<{ text: string, icon: string } | undefined>> = ref([
	undefined,
	{ text: 'Profile',				icon: 'material-symbols:person' },
	undefined,
	// { text: 'Add to Friend',		icon: 'material-symbols:person-add' },
	// { text: 'Add to Group',			icon: 'material-symbols:group-add' },
	{ text: 'Invite to Lobby',		icon: 'material-symbols:stadia-controller' },
])

</script>

<template>
	<div class="flex flex-col w-full px-2 py-4 text-sm border-4 rounded-b-lg rounded-tl-lg shadow-lg border-color1 bg-background1 text-text">
		<GenericProfilePicture :imageSrc="user?.avatar ?? '/pp.png'" class="self-center w-32 h-32" :userId="props.userId"/>
		<div class="w-full p-2 mt-3 text-xl">{{ user.name }}</div>
		<template v-for="elem in test">
			<template v-if="elem">
				<button class="flex px-2 py-1 rounded cursor-pointer hover:bg-accent1 hover:text-text-dark">
					<div class="w-5">
						<Icon :name="elem.icon" class="w-4 h-4"/>
					</div>
					<div class="ml-4">{{ elem.text }}</div>
				</button>
			</template>
			<template v-else>
				<hr class="my-3 border-text" />
			</template>
		</template>
	</div>
</template>