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

const open2faSetup = ref();
const open2faRemove = ref();


</script>

<template>
	<div class="p-5">
		<GenericButton @click="() => changeTheme()"
			:buttonStyle="1"
			class="self-center h-12 pl-1 pr-1 m-2"
		>
			Change Theme
		</GenericButton>
		
		<GenericButton @click="open2faSetup?.open"
			:buttonStyle="1"
			class="self-center h-12 pl-1 pr-1 m-2 "
		>
			Activate 2 factor authentication
		</GenericButton>
		<GenericModal ref="open2faSetup">
			<Activate2fa :close="open2faSetup?.close"/>
		</GenericModal>

		<GenericButton @click="open2faRemove?.open"
			:buttonStyle="1"
			class="self-center h-12 pl-1 pr-1 m-2 "
		>
			Disable 2 factor authentication
		</GenericButton>
		<GenericModal ref="open2faRemove">
			<Deactivate2fa :close="open2faRemove?.close"/>
		</GenericModal>
	</div>
</template>