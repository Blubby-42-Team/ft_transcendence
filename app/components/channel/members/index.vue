<script lang="ts" setup>

const props = defineProps({
	members: {
		type: Array<number>,
		required: true,
	},
})

const hasSideMenu = useState<boolean>('hasSideMenu');
const isSideMenuOpen = useState<boolean>('isSideMenuOpen', () => true);
</script>

<template>
	<div class="h-full">
		<ClientOnly>
			<template v-if="hasSideMenu">
				<teleport to="#additionalHeaderButton">
					<GenericButton :buttonStyle="1" class="self-center w-12 h-12"
						@click="isSideMenuOpen = !isSideMenuOpen"
					>
						<Icon name="material-symbols:menu" class="w-full h-full"/>
					</GenericButton>
				</teleport>
			</template>
		</ClientOnly>
		<template v-if="hasSideMenu && isSideMenuOpen">
			<div class="h-full w-60">
				<div class="w-full h-full overflow-x-hidden scrollbar bg-background1 scrollbar-w-0">
					<template v-for="member in props.members">
						<ChannelMembersSingle :member="member"/>
					</template>
				</div>
			</div>
		</template>
	</div>
</template>


