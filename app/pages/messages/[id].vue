<script lang="ts" setup>

definePageMeta({name: 'Channel'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.MESSAGES); })

const { selectedChannel, fetchChannelList, selectChannel } = useChannelStore();
const { primaryUser } = useUserStore();
const route = useRoute();

fetchChannelList(primaryUser.value.id);
selectChannel(route.params.id);

</script>

<template>
	<ChannelLayout>
		<template v-if="selectedChannel">
			<ChannelMessages :channel="selectedChannel"/>
			<ChannelMessagesWrite/>
		</template>
		<template>
			Loading...
		</template>
	</ChannelLayout>
</template>