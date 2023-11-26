<script lang="ts" setup>

definePageMeta({name: 'Message'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.MESSAGES, "My Message"); })

const { selectedChannel, isSideMenuOpen, selectedChannelType, toggleSideMenu } = useChannelListStore()

</script>

<template>
	<template v-if="selectedChannelType?.hasSideMenu">
		<div class="absolute top-0 h-16 p-2 right-[7.25rem] bg-first z-20 rounded-bl-xl">
			<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mr-0"
				@click="toggleSideMenu"
			>
				<Icon name="material-symbols:menu" class="w-full h-full"/>
			</GenericButton>
		</div>
	</template>
	<div class="grid grid-flow-col h-full grid-rows-[4rem_auto]" :class="isSideMenuOpen ? 'grid-cols-[16em,auto,max-content]' : 'grid-cols-[16em,auto]'">
		<div class="bg-first"></div>
		<div></div>
		<!-- <MessageSelectingChannelList/> -->
		<div class="bg-first">
			<div class="flex items-center justify-center h-full text-xl text-text-light">
				{{ selectedChannel?.name }}
			</div>
		</div>
		<!-- <div></div> -->
		<MessageChannel :id="0"/>
		<template v-if="isSideMenuOpen">
			<div class="bg-first"></div>
			<MessageGroupChannelMemberList/>
		</template>
	</div>
</template>