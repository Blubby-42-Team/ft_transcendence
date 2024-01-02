<script lang="ts" setup>

definePageMeta({name: 'Profil'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })

const { primaryUser } = useUserStore();
const route = useRoute();7

const openAddFriend = ref();

const userId = (typeof route.params.id === 'string' && !isNaN(parseInt(route.params.id))) ? parseInt(route.params.id) : 0;
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
				</Teleport>
				<GenericModal ref="openAddFriend">
					<FriendsInteractionAdd :closeFunc="openAddFriend?.close" :userId="userId"/>
				</GenericModal>
			</template>
		</ClientOnly>
		<Profile :userId="userId"/>
	</div>
</template>