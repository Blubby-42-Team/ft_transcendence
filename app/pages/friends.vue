<script lang="ts" setup>

definePageMeta({name: 'Friends'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.FRIENDS, "My Friends"); })

const testRef		= ref()
const testButton	= ref<HTMLElement>()

const test: Array<{ text: string, icon: string } | undefined> = [
	{ text: 'Zoom',				icon: 'material-symbols:zoom-in' },
	{ text: 'Zoom Out',			icon: 'material-symbols:zoom-out' },
	{ text: 'Full Screen',		icon: 'material-symbols:open-in-full' },
	{ text: 'Share',			icon: 'material-symbols:share' },
	undefined,
	{ text: 'Go Back',			icon: 'material-symbols:arrow-back' },
	{ text: 'Add to Wallet',	icon: 'material-symbols:wallet' },
]

const sideMenu = {
	reference: testButton,
	direction: 'top',
}

</script>

<template>
	<div class="h-full p-5">
		<div :buttonStyle="1"
			@click="testRef?.open"
			class="flex w-32 p-5 bg-red-900 hover:bg-red-950 rounded-2xl"
			ref="testButton"
		>
			Hello World
		</div>
		<GenericSideMenu ref="testRef" :options="sideMenu" direction="top">
			<div class="w-full">
				<div class="flex flex-col w-full px-2 py-4 text-sm border-4 rounded-lg shadow-lg border-pink-500 text-pink-500 bg-pink-500">
					<!-- <GenericProfilePicture imageSrc="/amogus.png"/> -->
					<div class="w-full p-2 mt-3 text-base">James Milwaukee</div>
					<hr class="my-3 border-pink-500" />
					<template v-for="elem in test">
						<template v-if="elem">
							<button class="flex px-2 py-1 rounded cursor-pointer hover:bg-pink-500 hover:text-pink-500">
								<div class="w-5">
									<Icon :name="elem.icon" class="w-4 h-4"/>
								</div>
								<div class="ml-4">{{ elem.text }}</div>
							</button>
						</template>
						<template v-else>
							<hr class="my-3 border-pink-500" />
						</template>
					</template>
				</div>
			</div>
		</GenericSideMenu>
	</div>
</template>