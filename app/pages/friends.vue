<script lang="ts" setup>

definePageMeta({name: 'Friends'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.FRIENDS); })

const openFindFriend = ref();

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
						<FriendsFind :closeFunc="openFindFriend?.close"/>
					</GenericModal>

					<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1">
						<Icon name="material-symbols:person-remove" class="w-full h-full"/>
					</GenericButton>

					<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mx-1">
						<Icon name="material-symbols:stadia-controller" class="w-full h-full"/>
					</GenericButton>
					
				</Teleport>
			</ClientOnly>
		</div>
		<FriendsList class="scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color1 scrollbar-thumb-rounded-full scrollbar-track"/>
		<template v-if="selectedFriend">
			<Profile class="max-h-full overflow-hidden" :userId="selectedFriend" />
		</template>
		<template>
			<div></div>
		</template>
	</div>
</template>