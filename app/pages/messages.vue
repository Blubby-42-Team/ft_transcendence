<script lang="ts" setup>

definePageMeta({name: 'Message'})
const { setPageData } = usePageStore();
onMounted(() => { setPageData(EPageCategories.MESSAGES, "My Message"); })

const isSideMenuOpen		= useState('isSideMenuOpen', () => false);
const hasSideMenu			= useState('hasSideMenu', () => false);
const selectedChannelName	= useState('selectedChannelName', () => 'Friends 1');
const channelTypes			= useState('channels', () => [
	{
		name: 'Friends',
		icon: 'material-symbols:person',
		open: false,
		hasBottom: true,
		hasSideMenu: false,
		channels: [
			'Friend 0',
			'Friend 1',
			'Friend 2',
			'Friend 3',
			'Friend 4',
			'Friend 5',
			'Friend 6',
			'Friend 7',
			'Friend 8',
			'Friend 9',
		]
	},
	{
		name: 'Groups',
		icon: 'material-symbols:diversity-4',
		open: true,
		hasBottom: true,
		hasSideMenu: true,
		channels: [
			'Group 0',
			'Group 1',
			'Group 2',
			'Group 3',
			'Group 4',
			'Group 5',
			'Group 6',
			'Group 7',
			'Group 8',
			'Group 9',
		]
	},
	{
		name: 'Chats',
		icon: 'material-symbols:groups',
		open: false,
		hasBottom: false,
		hasSideMenu: true,
		channels: [
			'Chats 0',
			'Chats 1',
			'Chats 2',
			'Chats 3',
			'Chats 4',
			'Chats 5',
			'Chats 6',
			'Chats 7',
			'Chats 8',
			'Chats 9',
		]
	},
])

</script>

<template>
	<div class="grid h-full grid-rows-[100%]" :class="isSideMenuOpen ? 'grid-cols-[16em,1fr,auto]' : 'grid-cols-[16em,1fr]'">
		<MessageSelectingChannelList/>

		<MessageChannel :id="0"/>

		<MessageGroupChannelMemberList/>
	</div>
</template>