<script setup lang="ts">

const test: Ref<Array<{ text: string, icon: string } | undefined>> = ref([
	undefined,
	{ text: 'Zoom',				icon: 'material-symbols:zoom-in' },
	{ text: 'Zoom Out',			icon: 'material-symbols:zoom-out' },
	{ text: 'Full Screen',		icon: 'material-symbols:open-in-full' },
	{ text: 'Share',			icon: 'material-symbols:share' },
	undefined,
	{ text: 'Go Back',			icon: 'material-symbols:arrow-back' },
	{ text: 'Add to Wallet',	icon: 'material-symbols:wallet' },
])

function addNewElementInTest(){
	test.value.push({ text: 'Hello', icon: 'material-symbols:zoom-in' })
}

</script>

<template>
	<div class="w-full">
		<div class="flex flex-col w-full px-2 py-4 text-sm border-4 rounded-b-lg rounded-tl-lg shadow-lg border-color1 bg-background1">
			<GenericProfilePicture imageSrc="/amogus.png" class="self-center w-32 h-32"/>
			<div class="w-full p-2 mt-3 text-base">James Milwaukee</div>
			<template v-for="elem in test">
				<template v-if="elem">
					<button class="flex px-2 py-1 rounded cursor-pointer hover:bg-accent1 hover:text-text-dark" @click="addNewElementInTest">
						<div class="w-5">
							<Icon :name="elem.icon" class="w-4 h-4"/>
						</div>
						<div class="ml-4">{{ elem.text }}</div>
					</button>
				</template>
				<template v-else>
					<hr class="my-3 border-text" />
				</template>
			</template>
		</div>
	</div>
</template>