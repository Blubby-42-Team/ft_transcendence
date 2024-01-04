<script lang="ts" setup>

definePageMeta({name: 'History'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.HISTORY); })

const { getHistory, fetchHistory, primaryUser } = useUserStore();
let history = getHistory(computed(() => primaryUser.value.id));

await fetchHistory(primaryUser.value.id);

</script>

<template>
	<div class="grid h-full grid-rows-[4rem_1fr]">
		<div class="flex bg-color1">
			<ClientOnly>
				<Teleport to="#additionalHeaderButton">
					<div class="mx-2 border border-text-light bg-text-light"></div>
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12"
						@click="fetchHistory(primaryUser.id)"
					>
						<Icon name="material-symbols:refresh" class="w-full h-full"/>
					</GenericButton>
				</Teleport>
			</ClientOnly>
		</div>
		<div class="flex justify-center h-full p-5 overflow-hidden">
			<div class="p-5 rounded-3xl bg-background1 w-[60rem] h-full">
				<HistoryList :matchList="history" :userId="primaryUser.id"/>
			</div>
		</div>
	</div>
</template>