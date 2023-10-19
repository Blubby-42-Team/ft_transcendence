<script lang="ts" setup>

definePageMeta({name: 'Settings'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.SETTINGS, "Settings"); })

const themes = [
	'theme-dark-blue',
	'theme-light-blue',
];

const themeIndex	= useState('themeIndex',	() => 0);
const theme			= useState('theme',			() => themes[themeIndex.value]);

function changeTheme(){
	themeIndex.value = themeIndex.value + 1 < themes.length ? themeIndex.value + 1 : 0;
	theme.value = themes[themeIndex.value];
}

</script>

<template>
	<div class="p-5">
		<GenericButton @click="() => changeTheme()"
			:buttonStyle="1"
			class="self-center h-12 pl-1 pr-1"
		>
			Change Theme
		</GenericButton>
	</div>
</template>