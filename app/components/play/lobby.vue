<script setup lang='ts'>

const route = useRoute()
const paths = [
	{ name: 'Local',	path: '/game/lobby/local'},
	{ name: 'Classic',	path: '/game/lobby/classic'},
	{ name: 'Random',	path: '/game/lobby/random'},
	{ name: 'Custom',	path: '/game/lobby/Custom'},
]

</script>
	
<template>
	<div class="grid h-full grid-rows-[4rem_auto]">
		<div class="grid h-16 grid-cols-4 gap-1 p-1 bg-color1">
			<template v-for="elem in paths">
				<GenericNuxtLink :button-style="1"
					class="rounded-md bg-color3 bg-opacity-20"
					:class="css.has({
						'bg-opacity-80': elem.path === route.path,
					})"	
					:to="elem.path"
				>
					{{ elem.name }}
				</GenericNuxtLink>
			</template>
		</div>
		<div>
			<slot/>
		</div>
	</div>
</template>
