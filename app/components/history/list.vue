<script lang="ts" setup>

const props = defineProps({
	userId: {
		type: Number,
		required: true,
	},
	matchList: {
		type: Array as PropType<IHistory[]>,
		required: true,
	},
})

const reverse = computed(() => props.matchList.sort((a, b) => a.date > b.date ? -1 : 1))

</script>

<template>
	<div class="h-full col-span-2 overflow-auto scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-color1 scrollbar-thumb-rounded-full scrollbar-track">
		<div class="grid w-full grid-rows-[3rem] grid-cols-[2rem,auto,auto,auto,6rem]">
			<div class="sticky top-0 flex items-center justify-center h-12 border-b border-text border-opacity-30 bg-background1"></div>
			<div class="sticky top-0 flex items-center justify-center h-12 border-b border-text border-opacity-30 bg-background1">Date</div>
			<div class="sticky top-0 flex items-center justify-center h-12 border-b border-text border-opacity-30 bg-background1">Adversary</div>
			<div class="sticky top-0 flex items-center justify-center h-12 col-span-2 border-b border-text border-opacity-30 bg-background1">Score</div>
			<template v-for="match in reverse">
				<HistoryListElem :match="match" :userId="props.userId"/>
			</template>
		</div>
	</div>
</template>
