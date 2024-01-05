<script lang="ts" setup>

definePageMeta({name: 'Settings'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.SETTINGS); })

const { primaryUser } = useUserStore();

const theme = useState('theme');
function changeTheme(){
	switch (theme.value) {
		case ETheme.Dark:
			theme.value = ETheme.Light;
			fetchSettingsPatch(primaryUser.value.id, ETheme.Light, false);
			break;
		case ETheme.Light:
			theme.value = ETheme.Dark;
			fetchSettingsPatch(primaryUser.value.id, ETheme.Dark, false);
			break;
		default: break;
	}
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