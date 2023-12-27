<script lang="ts" setup>

definePageMeta({name: 'My Profil'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })

const { primaryUser } = useUserStore();

const openFindFriend = ref();

</script>

<template>
	<div class="h-full">
		<ClientOnly>
			<teleport to="#additionalHeaderButton">
				<div class="mx-2 border border-text-light bg-text-light"></div>
				<GenericButton :buttonStyle="1" class="self-center w-12 h-12"
					@click="openFindFriend?.open"
				>
					<Icon name="material-symbols:edit" class="w-full h-full"/>
				</GenericButton>
				<GenericModal ref="openFindFriend">
					<ProfileRename :close="openFindFriend?.close"/>
				</GenericModal>
			</teleport>
		</ClientOnly>
		<Profile :userId="primaryUser.id"/>
	</div>
</template>