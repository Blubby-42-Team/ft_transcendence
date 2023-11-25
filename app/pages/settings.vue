<script lang="ts" setup>

definePageMeta({name: 'Settings'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.SETTINGS, "Settings"); })

const themes = [
	'theme-dark',
	'theme-dark-blue',
	'theme-light-blue',
];

const themeIndex	= useState('themeIndex',	() => 0);
const theme			= useState('theme',			() => themes[themeIndex.value]);

function changeTheme(){
	themeIndex.value = themeIndex.value + 1 < themes.length ? themeIndex.value + 1 : 0;
	theme.value = themes[themeIndex.value];
}

const FormRef = ref()
const FormRef2 = ref()

</script>

<template>
	<div class="p-5">
		<GenericModal ref="FormRef">
			<div class="w-32 h-40">
				Test1
			</div>
		</GenericModal>
		<GenericModal ref="FormRef2">
			<div class="w-32 h-40">
				Test2
			</div>
		</GenericModal>
		<GenericButton @click="() => changeTheme()"
			:buttonStyle="1"
			class="self-center h-12 pl-1 pr-1"
		>
			Change Theme
		</GenericButton>
		<GenericButton
			@click="FormRef?.open()"
			:buttonStyle="1"
			class="self-center h-12 pl-1 pr-1"
		>
			Open Modal
		</GenericButton>
		<GenericButton
			@click="FormRef2?.open()"
			:buttonStyle="1"
			class="self-center h-12 pl-1 pr-1"
		>
			Open Modal
		</GenericButton>
	</div>
</template>