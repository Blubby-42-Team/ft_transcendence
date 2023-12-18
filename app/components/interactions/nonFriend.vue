<script lang="ts" setup>

function openContextMenu() {
	console.log('hello')
}

</script>

<template>
	<div class="grid grid-cols-[3rem_auto] grid-rows-[3rem] overflow-hidden border-4 border-color1 bg-background2 rounded-2xl">
		<button class="w-full contents group"
			@click="openContextMenu"
		>
			<Icon class="flex items-center w-full h-full p-2 transition duration-200 group-hover:bg-color2 group-hover:text-text-light group-active:bg-color1" name="material-symbols:person-add"/>
			<div class="flex items-center w-full h-full p-2 transition duration-200 group-hover:bg-color2 group-hover:text-text-light group-active:bg-color1">Invite to Chat</div>
		</button>
		<button class="w-full p-4 contents group">
			<Icon class="flex items-center w-full h-full p-2 transition duration-200 group-hover:bg-color2 group-hover:text-text-light group-active:bg-color1" name="material-symbols:group-add"/>
			<div class="flex items-center w-full h-full p-2 transition duration-200 group-hover:bg-color2 group-hover:text-text-light group-active:bg-color1">Invite to Chat</div>
		</button>
		<button class="w-full p-4 contents group"
			@click="openContextMenu"
		>
			<Icon class="flex items-center w-full h-full p-2 transition duration-200 group-hover:bg-color2 group-hover:text-text-light group-active:bg-color1" name="material-symbols:stadia-controller"/>
			<div class="flex items-center w-full h-full p-2 transition duration-200 group-hover:bg-color2 group-hover:text-text-light group-active:bg-color1">Invite to Party</div>
		</button>
	</div>
</template>