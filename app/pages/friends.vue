<script lang="ts" setup>

definePageMeta({name: 'Friends'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.FRIENDS); })

const testRef		= ref()
const testButton	= ref<HTMLElement>()

</script>

<template>
	<div class="h-full p-5">
		<div class="flex bg-blue-500 w-[22rem]">Hello</div>
		<GenericButton id="testButton" :buttonStyle="1" @click="testRef?.open" class="w-32 h-10 p-2">
			Hello World
		</GenericButton>
		<GenericSideMenu ref="testRef" direction="bottom" alignDirection="right" :containerRef="testButton" buttonId="testButton">
			<MessageProfile/>
		</GenericSideMenu>
	</div>
</template>