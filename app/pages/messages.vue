<script lang="ts" setup>


definePageMeta({name: 'Message'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.MESSAGES); })

const isSideMenuOpen = useState('isSideMenuOpen', () => true);
const types = useState<Array<channelTypeSettings>>('channelTypes', () => [
	{
		type: ChannelType.Friend,
		name: 'Friends',
		icon: 'material-symbols:person',
		open: false,
		hasBottom: true,
		hasSideMenu: false,
	},
	{
		type: ChannelType.Group,
		name: 'Groups',
		icon: 'material-symbols:diversity-4',
		open: false,
		hasBottom: true,
		hasSideMenu: true,
	},
	{
		type: ChannelType.Chat,
		name: 'Chats',
		icon: 'material-symbols:groups',
		open: false,
		hasBottom: false,
		hasSideMenu: true,
	}
]);

const { selectedChannel, channels, fetchChannelList } = useChannelStore();
const { primaryUser } = useUserStore();
fetchChannelList(primaryUser.value.id);

</script>

<template>
	<div class="grid h-full grid-rows-[4em_auto] overflow-hidden" :class="css.has({'grid-cols-[16em,1fr,auto] || grid-cols-[16em,1fr]': isSideMenuOpen})">
		<div class="h-16 p-2 text-lg bg-color1 text-text-light" :class="css.has({'col-span-2 || col-span-3': !isSideMenuOpen})">
			<div class="flex items-center justify-center h-full ">
				{{ selectedChannel?.name }}
			</div>
		</div>

		<MessageSelectingChannelList/>

		<template v-if="selectedChannel !== null">
			<MessageChannel :channel="selectedChannel"/>
		</template>
		<template v-else>
			<div class="w-full p-5">{{ channels }}</div>
		</template>

		<MessageGroupChannelMemberList
			:members="selectedChannel?.members ?? []"
			:type="types.find((elem) => elem.type === selectedChannel?.type) ?? types[0]"
		/>
	</div>
</template>