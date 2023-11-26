<script lang="ts" setup>
const { members }		= useChannelStore()

const { isSideMenuOpen, selectedChannelType, toggleSideMenu } = useChannelListStore()

</script>

<template>
	<template v-if="selectedChannelType?.hasSideMenu">
		<div class="grid grid-rows-[auto]" :class="(isSideMenuOpen ? 'w-60' : 'w-14')">
			<div class="overflow-x-hidden scrollbar bg-background1 scrollbar-w-0">
				<template v-for="member in members">
					<GenericButton class="w-full p-1" :buttonStyle="2">
						<GenericProfilePicture class="w-10 h-10" imageSrc="/amogus.png"/>
						<div class="self-center pl-2">
							{{ member.name }}
						</div>
						<div class="mr-auto"></div>
					</GenericButton>
				</template>
			</div>
		</div>
	</template>
</template>


