<script lang="ts" setup>

const props = defineProps({
	members: {
		type: Array<number>,
		required: true,
	},
	type: {
		type: Object as PropType<channelTypeSettings>,
		required: true,
	}
})

const isSideMenuOpen = useState('isSideMenuOpen');

</script>

<template>
	<div class="h-full">
		<ClientOnly>
			<template v-if="props.type.hasSideMenu">
				<teleport to="#additionalHeaderButton">
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12"
						@click="isSideMenuOpen = !isSideMenuOpen"
					>
						<Icon name="material-symbols:menu" class="w-full h-full"/>
					</GenericButton>
				</teleport>
			</template>
		</ClientOnly>
		<template v-if="props.type.hasSideMenu && isSideMenuOpen">
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


