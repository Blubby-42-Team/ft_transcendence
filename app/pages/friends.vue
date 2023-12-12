<script lang="ts" setup>

definePageMeta({name: 'Friends'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.FRIENDS); })

const testRef		= ref()
const testButton	= ref<HTMLElement>()

const test: Array<{ text: string, icon: string } | undefined> = [
	undefined,
	{ text: 'Zoom',				icon: 'material-symbols:zoom-in' },
	{ text: 'Zoom Out',			icon: 'material-symbols:zoom-out' },
	{ text: 'Full Screen',		icon: 'material-symbols:open-in-full' },
	{ text: 'Share',			icon: 'material-symbols:share' },
	undefined,
	{ text: 'Go Back',			icon: 'material-symbols:arrow-back' },
	{ text: 'Add to Wallet',	icon: 'material-symbols:wallet' },
]

const accessRef = () => testButton

</script>

<template>
	<div class="h-full p-5">
		<div class="flex bg-blue-500 w-[22rem]">Hello</div>
		<div ref="testButton" class="bg-red-500 w-max h-max">
			<GenericButton :buttonStyle="1" @click="testRef?.open"
				class="w-32 h-10 p-2"
			>
				Hello World
			</GenericButton>
		</div>
		<GenericSideMenu ref="testRef" direction="bottom" alignDirection="left" :containerRef="accessRef">
			<div class="w-full">
				<div class="flex flex-col w-full px-2 py-4 text-sm border-4 rounded-lg shadow-lg border-color1 bg-background1">
					<GenericProfilePicture imageSrc="/amogus.png" class="w-96 h-96"/>
					<div class="w-full p-2 mt-3 text-base">James Milwaukee</div>
					<template v-for="elem in test">
						<template v-if="elem">
							<button class="flex px-2 py-1 rounded cursor-pointer hover:bg-accent1 hover:text-text-dark">
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
		</GenericSideMenu>
	</div>
</template>