<script lang="ts" setup>

const { members }		= useChannelStore()

const { isSideMenuOpen, selectedChannelType, toggleSideMenu } = useChannelListStore()

const viewProfile = ref()

</script>

<template>
	<div class="h-full overflow-x-hidden scrollbar bg-background1 scrollbar-w-0 w-60">
		<template v-for="member in members">
			<GenericButton class="w-full p-1" :buttonStyle="2" @click="viewProfile?.open">
				<GenericProfilePicture class="w-10 h-10" imageSrc="/amogus.png"/>
				<div class="self-center pl-2">
					{{ member.name }}
				</div>
				<div class="mr-auto"></div>
			</GenericButton>
		</template>
	</div>
</template>