<script lang="ts" setup>

definePageMeta({name: 'Profil'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })

const { primaryUser } = useUserStore();
const route = useRoute();7

const openAddFriend = ref();
const openBlockFriend = ref();
const openUnblockFriend = ref();

const userId = (typeof route.params.id === 'string' && !isNaN(parseInt(route.params.id))) ? parseInt(route.params.id) : 0;

const isBlocked = ref(false);
await fetchUserIsInBlacklist(primaryUser.value.id, userId, (res) => {
	isBlocked.value = res;
});
console.log(isBlocked.value);

async function refetchBlocked(){
	await fetchUserIsInBlacklist(primaryUser.value.id, userId, (res) => {
		isBlocked.value = res;
	});
	console.log(isBlocked.value);
}

function block(){
	openBlockFriend.value.open();
	refetchBlocked();
}

function unblock(){
	openUnblockFriend.value.open();
	refetchBlocked();
}

</script>

<template>
	<div class="h-full">
		<ClientOnly>
			<template v-if="userId !== primaryUser.id">
				<Teleport to="#additionalHeaderButton">
					<div class="mx-2 border border-text-light bg-text-light"></div>
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12"
						@click="openAddFriend?.open"
					>
						<Icon name="material-symbols:add" class="w-full h-full"/>
					</GenericButton>
					<template v-if="isBlocked === true">
						<GenericButton :buttonStyle="1" class="self-center w-12 h-12"
							@click="unblock"
						>
							<Icon name="material-symbols:account-circle" class="w-full h-full"/>
						</GenericButton>
					</template>
					<template v-else>
						<GenericButton :buttonStyle="1" class="self-center w-12 h-12"
							@click="block"
						>
							<Icon name="material-symbols:no-accounts" class="w-full h-full"/>
						</GenericButton>
					</template>
				</Teleport>
				<GenericModal ref="openAddFriend">
					<FriendsInteractionAdd :closeFunc="openAddFriend?.close" :userId="userId"/>
				</GenericModal>
				<GenericModal ref="openBlockFriend">
					<FriendsInteractionBlock :closeFunc="openAddFriend?.close" :testFunc="refetchBlocked" :userId="userId"/>
				</GenericModal>
				<GenericModal ref="openUnblockFriend">
					<FriendsInteractionUnblock :closeFunc="openAddFriend?.close" :testFunc="refetchBlocked" :userId="userId"/>
				</GenericModal>
			</template>
		</ClientOnly>
		<Profile :userId="userId"/>
	</div>
</template>