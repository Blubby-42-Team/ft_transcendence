<script lang="ts" setup>

definePageMeta({name: 'Friends'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.FRIENDS); })

const testRef		= ref();
const testButton	= ref();

const test = () => testButton;

</script>

<template>
	<div class="h-full p-5">
		<div class="flex bg-blue-500 w-[22rem]">Hello</div>
		<div ref="testButton">
			<GenericButton :buttonStyle="1" @click="testRef?.open" class="w-32 h-10 p-2" >
				Hello World
			</GenericButton>
		</div>
		<GenericSideMenu ref="testRef" direction="bottom" alignDirection="right" :accessRef="test">
			<MessageProfile/>
		</GenericSideMenu>
	</div>
</template>