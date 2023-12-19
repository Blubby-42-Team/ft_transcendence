<script lang="ts" setup>

const { members }		= useChannelStore()

const { isSideMenuOpen, selectedChannelType, toggleSideMenu } = useChannelListStore()

const viewProfile = ref()

</script>

<template>
	<div>
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
			<div class="grid h-full grid-rows-[4rem,auto]" :class="(isSideMenuOpen ? 'w-60' : 'w-14')">
				<div class="bg-color1"></div>
				<div class="overflow-x-hidden scrollbar bg-background1 scrollbar-w-0">
					<template v-for="member in members">
						<MessageChannelMemberPreview :member="member"/>
					</template>
				</div>
			</div>
		</template>
	</div>
</template>


