<script lang="ts" setup>

const props = defineProps({
	members: {
		type: Array<number>,
		required: true,
	},
})

const { activeType } = useChannelStore();
const isSideMenuOpen = useState<boolean>('isSideMenuOpen', () => true);

</script>

<template>
	<div class="h-full">
		<template v-if="activeType.hasSideMenu && isSideMenuOpen">
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


