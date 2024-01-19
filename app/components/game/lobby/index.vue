<script setup lang='ts'>

const pageStore = usePageStore();
const { selectedLobby, lobby } = storeToRefs(pageStore);

</script>
	
<template>
	<div class="grid h-full grid-rows-[4rem_auto]">
		<div class="grid h-16 grid-cols-[auto_8rem] bg-color1">
			<div class="grid h-16 grid-cols-[repeat(2,1fr)] gap-1 p-1">
				<template v-for="elem in lobby">
					<GenericNuxtLink :button-style="1"
						class="rounded-md bg-color2 bg-opacity-20"
						:class="css.has({
							'bg-opacity-80': elem.id === selectedLobby,
						})"	
						:to="elem.path"
					>
						{{ elem.name }}
					</GenericNuxtLink>
				</template>
			</div>
		</div>
		<div>
			<slot/>
		</div>
	</div>
</template>
