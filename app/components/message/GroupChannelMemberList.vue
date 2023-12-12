<script lang="ts" setup>
const { members }		= useChannelStore()

const { isSideMenuOpen, selectedChannelType, toggleSideMenu } = useChannelListStore()

</script>

<template>
	<div>
		<template v-if="selectedChannelType?.hasSideMenu">
			<div class="absolute top-0 h-16 p-2 right-[7.25rem] bg-color1 rounded-bl-xl">
				<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mr-0"
					@click="toggleSideMenu"
				>
					<Icon name="material-symbols:menu" class="w-full h-full"/>
				</GenericButton>
			</div>
		</template>
		<template v-if="selectedChannelType?.hasSideMenu && isSideMenuOpen">
			<div class="grid h-full grid-rows-[4rem,auto]" :class="(isSideMenuOpen ? 'w-60' : 'w-14')">
				<div class="bg-color1"></div>
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
	</div>
</template>


