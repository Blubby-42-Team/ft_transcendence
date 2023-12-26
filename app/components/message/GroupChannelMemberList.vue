<script lang="ts" setup>

const props = defineProps({
	members: {
		type: Array<number>,
		required: true,
	},
})


const { isSideMenuOpen, selectedChannelType, toggleSideMenu } = useChannelListStore()

</script>

<template>
	<div class="w-full min-w-[12rem]">
		<ClientOnly>
			<template v-if="selectedChannelType?.hasSideMenu">
				<teleport to="#additionalHeaderButton">
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12"
						@click="toggleSideMenu"
					>
						<Icon name="material-symbols:menu" class="w-full h-full"/>
					</GenericButton>
				</teleport>
			</template>
		</ClientOnly>
		<template v-if="selectedChannelType?.hasSideMenu && isSideMenuOpen">
			<div class="w-full h-full" :class="(isSideMenuOpen ? 'w-60' : 'w-14')">
				<div class="w-full h-full overflow-x-hidden scrollbar bg-background1 scrollbar-w-0">
					<template v-for="member in props.members">
						<MessageChannelMemberPreview :member="member"/>
					</template>
				</div>
			</div>
		</template>
	</div>
</template>


