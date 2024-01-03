<script lang="ts" setup>

definePageMeta({name: 'Settings'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.SETTINGS); })

const theme = useState('theme');
function changeTheme(){
	switch (theme.value) {
		case 'theme-dark': theme.value = 'theme-light'; break;
		case 'theme-light': theme.value = 'theme-dark';	break;
		default: break;
	}
}

const FormRef = ref()
const FormRef2 = ref()

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