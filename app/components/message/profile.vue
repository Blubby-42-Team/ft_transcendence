<script setup lang="ts">

const { getUser, fetchUser, fetchHistory } = useUserStore();
const user = getUser(42);
await fetchUser(42);
await fetchHistory(42);

const test: Ref<Array<{ text: string, icon: string } | undefined>> = ref([
	undefined,
	{ text: 'Profile',				icon: 'material-symbols:person' },
	undefined,
	{ text: 'Add to Friend',		icon: 'material-symbols:person-add' },
	{ text: 'Add to Group',			icon: 'material-symbols:group-add' },
	{ text: 'Invite to Lobby',		icon: 'material-symbols:stadia-controller' },
])

</script>

<template>
	<div class="w-full">
		<div class="flex flex-col w-full px-2 py-4 text-sm border-4 rounded-b-lg rounded-tl-lg shadow-lg border-color1 bg-background1">
			<GenericProfilePicture :imageSrc="user.avatar" class="self-center w-32 h-32"/>
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
	</div>
</template>