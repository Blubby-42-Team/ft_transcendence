<script lang="ts" setup>

definePageMeta({name: 'Friends'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.FRIENDS); })

const openFindFriend = ref();
const openInviteToPlay = ref();
const openRemoveFriend = ref();

const selectedFriend = useState<number | null>('selectedFriend', () => null);

</script>

<template>
	<div class="grid h-full grid-rows-[4rem,1fr] grid-cols-[max-content,auto]">
		<div class="col-span-2 bg-color1">
			<ClientOnly>
				<Teleport to="#additionalHeaderButton">

					<div class="mx-2 border border-text-light bg-text-light"></div>

					<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1"
						@click="openFindFriend?.open"
					>
						<Icon name="material-symbols:search" class="w-full h-full"/>
					</GenericButton>
					<GenericModal ref="openFindFriend">
						<FriendsInteractionSearch :closeFunc="openFindFriend?.close"/>
					</GenericModal>
					
					<template v-if="selectedFriend !== null">
						<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1"
							@click="openRemoveFriend?.open"
						>
							<Icon name="material-symbols:person-remove" class="w-full h-full"/>
						</GenericButton>
					</template>
					<GenericModal ref="openRemoveFriend">
						<FriendsInteractionRemove :closeFunc="openRemoveFriend?.close" :userId="selectedFriend ?? 0"/>
					</GenericModal>

					<template v-if="selectedFriend !== null">
						<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1"
							@click="openInviteToPlay?.open"
						>
							<Icon name="material-symbols:stadia-controller" class="w-full h-full"/>
						</GenericButton>
					</template>
					<GenericModal ref="openInviteToPlay">
						<FriendsInteractionInvite :closeFunc="openInviteToPlay?.close" :userId="selectedFriend ?? 0"/>
					</GenericModal>
					
				</Teleport>
			</ClientOnly>
		</div>
		<FriendsList class="scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color1 scrollbar-thumb-rounded-full scrollbar-track"/>
		<template v-if="selectedFriend">
			<Profile class="max-h-full overflow-hidden" :userId="selectedFriend" />
		</template>
		<template v-else>
			<div class="p-5">
				Is this page empty ? Use the
				<Icon class="w-8 h-8" name="material-symbols:search"/>
				to search for new friends !
			</div>
		</template>
	</div>
</template>