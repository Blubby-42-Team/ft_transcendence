<script lang="ts" setup>

definePageMeta({name: 'Profil'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.NONE); })

const { primaryUser } = useUserStore();
const route = useRoute();

const userId = (typeof route.params.id === 'string' && !isNaN(parseInt(route.params.id))) ? parseInt(route.params.id) : 0;
</script>

<template>
	<div class="h-full">
		<ClientOnly>
			<template v-if="userId !== primaryUser.id">
				<teleport to="#additionalHeaderButton">
					<div class="mx-2 border border-text-light bg-text-light"></div>
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12">
						<Icon name="material-symbols:add" class="w-full h-full"/>
					</GenericButton>
				</teleport>
			</template>
		</ClientOnly>
		<Profile :userId="userId"/>
	</div>
</template>