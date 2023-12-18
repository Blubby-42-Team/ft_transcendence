<script lang="ts" setup>

import { format } from 'date-fns'

definePageMeta({name: 'History'})
const { setSelectedCategory } = usePageStore();

onMounted(() => { setSelectedCategory(EPageCategories.HISTORY); })

</script>

<template>
	<div class="grid h-full grid-rows-[4rem,1fr]">
		<div class="flex bg-color1">
			<ClientOnly>
				<teleport to="#additionalHeaderButton">
					<div class="mx-2 border border-text-light bg-text-light"></div>
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12"
					>
						<Icon name="material-symbols:search" class="w-full h-full"/>
					</GenericButton>
				</teleport>
			</ClientOnly>
		</div>
		<div class="flex justify-center h-full p-5 overflow-hidden">
			<div class="p-5 rounded-3xl bg-background1 w-[60rem] h-full">
				<HistoryList :numberOfElem="30"/>
			</div>
		</div>
	</div>
</template>