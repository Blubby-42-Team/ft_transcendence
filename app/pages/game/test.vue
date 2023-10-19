<script lang="ts" setup>

definePageMeta({name: 'GameTest'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.GAME, "Testing Page"); })

</script>

<template>
	<div class="flex p-2">
		<div>
			<div class="flex p-2 m-2 rounded-lg bg-color1 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color1 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color1 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color1 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color1 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color1 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color1 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color1 w-max">Hello World</div>
		</div>
		<div>
			<div class="flex p-2 m-2 rounded-lg bg-color2 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color2 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color2 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color2 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color2 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color2 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color3 w-max">Hello World</div>
		</div>
		<div>
			<div class="flex p-2 m-2 rounded-lg bg-color3 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color3 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color3 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color3 w-max">Hello World</div>
			<div class="flex p-2 m-2 rounded-lg bg-color3 w-max">Hello World</div>
		</div>
	</div>
</template>