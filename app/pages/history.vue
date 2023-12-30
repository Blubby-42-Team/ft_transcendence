<script lang="ts" setup>

definePageMeta({name: 'History'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.HISTORY); })

const { getHistory, fetchHistory, primaryUser } = useUserStore();
let history = getHistory(computed(() => primaryUser.value.id));

await fetchHistory(primaryUser.value.id);

onMounted(async () => {
	console.log('fetching history', primaryUser.value.id)
	await fetchHistory(primaryUser.value.id);
	console.log('fetched history', history.value)
})

// watch(() => primaryUser.value.id, async (newVal, oldVal) => {
// 	console.log('fetching history', newVal, oldVal)
// 	console.log('xd', await fetchHistory(newVal));
// 	console.log('fetched history', history.value)
// })

</script>

<template>
	<div class="grid h-full grid-rows-[4rem,1fr]">
		<div class="flex bg-color1">
			<ClientOnly>
				<teleport to="#additionalHeaderButton">
					<div class="mx-2 border border-text-light bg-text-light"></div>
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12">
						<Icon name="material-symbols:refresh" class="w-full h-full"/>
					</GenericButton>
				</teleport>
			</ClientOnly>
		</div>
		<div class="flex justify-center h-full p-5 overflow-hidden">
			<div class="p-5 rounded-3xl bg-background1 w-[60rem] h-full">
				<HistoryList :matchList="history"/>
			</div>
		</div>
	</div>
</template>