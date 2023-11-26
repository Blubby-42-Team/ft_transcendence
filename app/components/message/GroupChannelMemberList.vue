<script lang="ts" setup>
const isSideMenuOpen	= useState('isSideMenuOpen');
const hasSideMenu		= useState('hasSideMenu');
const { members }		= useChannelStore()

</script>

<template>
	<div>
		<template v-if="hasSideMenu">
			<div class="absolute top-0 h-16 p-2 right-[7.25rem] bg-first z-20 rounded-bl-xl">
				<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mr-0"
					@click="() => { isSideMenuOpen = !isSideMenuOpen }"
				>
					<Icon name="material-symbols:menu" class="w-full h-full"/>
				</GenericButton>
			</div>
		</template>
		<template v-if="hasSideMenu && isSideMenuOpen">
			<div class="grid h-full grid-rows-[4rem,auto]" :class="(isSideMenuOpen ? 'w-60' : 'w-14')">
				<div class="bg-first"></div>
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


