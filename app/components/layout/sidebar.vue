<script setup lang="ts">
import { EPageCategories } from '@/stores/page'
const { selectedCategory } = usePageStore();

enum EType {
	CATEGORY			= 0,
	SEPARATOR_BAR		= 1,
	SEPARATOR_BOTTOM	= 2,
};

type TSidebarCategory = { type: EType.CATEGORY, categoryType: EPageCategories, path: string, icon: string } | { type: Exclude<EType, EType.CATEGORY> }

const categories: Ref<Array<TSidebarCategory>> = ref([
	{	type: EType.CATEGORY,				categoryType: EPageCategories.NONE, 		path: '/',				icon: '42'	},
	{	type: EType.CATEGORY,				categoryType: EPageCategories.GAME, 		path: '/game',			icon: 'material-symbols:stadia-controller'	},
	{	type: EType.CATEGORY,				categoryType: EPageCategories.TOURNAMENT,	path: '/tournament',	icon: 'material-symbols:trophy'	},
	{	type: EType.CATEGORY,				categoryType: EPageCategories.WATCH, 		path: '/watch',			icon: 'material-symbols:visibility'	},
	{	type: EType.SEPARATOR_BAR,																							},
	{	type: EType.CATEGORY,				categoryType: EPageCategories.MESSAGES, 	path: '/messages',		icon: 'material-symbols:chat'	},
	{	type: EType.CATEGORY,				categoryType: EPageCategories.FRIENDS, 		path: '/friends',		icon: 'material-symbols:group'	},
	{	type: EType.SEPARATOR_BOTTOM																						},
	{	type: EType.CATEGORY,				categoryType: EPageCategories.SETTINGS, 	path: '/settings',		icon: 'material-symbols:settings'	},
]);

</script>

<template>
	<div class="flex flex-col h-full p-2 overflow-hidden text-text-light bg-color1">
		<template v-for="category in categories">
			<template v-if="category.type === EType.CATEGORY">
				<NuxtLink :to="category.path"
					class="self-center w-10 h-10 m-2 text-center border-2 border-transparent rounded"
					:class="css.has({
						'text-accent hover:border-accent || hover:border-text-light': selectedCategory === category.categoryType && selectedCategory !== EPageCategories.NONE
					})"
				>
					<Icon :name="category.icon" class="w-full h-full"/>
				</NuxtLink>
			</template>
			<template v-else-if="category.type == EType.SEPARATOR_BAR">
				<!-- Separator with bar to distingate Categories -->
				<div class="mt-5 mb-5 border-t-2 border-text-light"></div>
			</template>
			<template v-else-if="category.type == EType.SEPARATOR_BOTTOM">
				<!-- Separator to between icons at the top and the bottom -->
				<div class="mb-auto"></div>
			</template>
		</template>
	</div>
</template>

