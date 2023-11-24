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

</script>

<template>
	<div class="h-full p-5">
		<div :buttonStyle="1" class="p-5 bg-red-900 hover:bg-red-950 rounded-2xl" @click="testRef?.open" ref="testButton">Hello World</div>
		<GenericSideMenu ref="testRef"
			:reference="testButton"
			direction="bottom"
		>
			<div class="w-full px-5 pt-1">
				<div class="flex flex-col w-full px-2 py-4 text-sm border-4 rounded-lg shadow-lg border-color3 text-text bg-color2">
					<!-- <GenericProfilePicture imageSrc="/amogus.png"/> -->
					<div class="w-full p-2 mt-3 text-base">James Milwaukee</div>
					<hr class="my-3 border-color3" />
					<template v-for="elem in test">
						<template v-if="elem">
							<button class="flex px-2 py-1 rounded cursor-pointer hover:bg-accent-color hover:text-color2">
								<div class="w-5">
									<Icon :name="elem.icon" class="w-4 h-4"/>
								</div>
								<div class="ml-4">{{ elem.text }}</div>
							</button>
						</template>
						<template v-else>
							<hr class="my-3 border-color3" />
						</template>
					</template>
				</div>
			</div>
		</GenericSideMenu>
	</div>
</template>