<script lang="ts" setup>

definePageMeta({name: 'Channel'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.MESSAGES); })

const channelStore = useChannelStore();
const { fetchChannelList, selectChannel, refreshChannel } = channelStore;
const { selectedChannel } = storeToRefs(channelStore);
const { primaryUser } = useUserStore();
const route = useRoute();

await fetchChannelList(primaryUser.value.id);
if (typeof route.params.id === 'string' && !isNaN(parseInt(route.params.id))){
	const channelId = parseInt(route.params.id);
	await selectChannel(primaryUser.value.id, channelId);

	if (process.client) {
		const socket = new SocketClientChannel()
	
		socket.subscribeToChannel(channelId, () => {
			// console.log("New message received");
			refreshChannel(primaryUser.value.id, channelId);
		});
	}
}


</script>

<template>
	<ChannelLayout>
		<template v-if="selectedChannel">
			<ChannelMessages :channel="selectedChannel"/>
			<ChannelMessagesWrite/>
		</template>
		<template v-else>
			Loading...
		</template>
	</ChannelLayout>
</template>