<script setup lang="ts">

let activateTest = ref(false)

</script>

<template>
	<div class="grid h-full grid-cols-[max-content_repeat(4,auto)]">
		<div class="border-r-4 w-96 bg-color2 border-color3">
			<div class="w-full col-span-2 p-2 text-3xl text-center bg-color3">Settings</div>
			<div class="grid grid-cols-[auto,5rem,3rem,3rem] p-1 gap-1">
				<div class="flex items-center h-full">Number of Players</div>
				<div class="flex items-center h-full">5</div>
				<GenericButton :buttonStyle="1" class="w-full h-12"><Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" class="w-full h-12"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>
				<div class="flex items-center h-full">Max Round</div>
				<div class="flex items-center h-full">5</div>
				<GenericButton :buttonStyle="1" class="w-full h-12"><Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" class="w-full h-12"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>
				<div class="flex items-center h-full">Ball Size</div>
				<div class="flex items-center h-full">5</div>
				<GenericButton :buttonStyle="1" class="w-full h-12"><Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" class="w-full h-12"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>
				<div class="flex items-center h-full">Pad Size</div>
				<div class="flex items-center h-full">5</div>
				<GenericButton :buttonStyle="1" class="w-full h-12"><Icon name="material-symbols:add" class="w-full h-full"/></GenericButton>
				<GenericButton :buttonStyle="1" class="w-full h-12"><Icon name="material-symbols:remove" class="w-full h-full"/></GenericButton>
				<div class="flex items-center h-full col-span-3">Activate Randomizer</div>
				<GenericButton :buttonStyle="1" class="w-full h-12" @click="() => activateTest = !activateTest">
					<template v-if="activateTest">
						<Icon name="material-symbols:check-box" class="w-full h-full"/>
					</template>
					<template v-else>
						<Icon name="material-symbols:check-box-outline-blank" class="w-full h-full"/>
					</template>
				</GenericButton>
			</div>
		</div>
		<div class="p-5 bg-red-400">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
		<div class="p-5 bg-red-500">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
		<div class="p-5 bg-red-600">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
		<div class="p-5 bg-red-700">
			<GenericProfilePicture imageSrc="/amogus.png"/>
			<div class="pt-2 text-xl ">James</div>
		</div>
	</div>
</template>
