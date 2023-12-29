<script lang="ts" setup>

definePageMeta({name: 'Message'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.MESSAGES); })

const { channels, fetchChannelList, selectChannel } = useChannelStore();
const { primaryUser } = useUserStore();

await fetchChannelList(primaryUser.value.id);
await selectChannel(primaryUser.value.id, 0);
</script>

<template>
	<ChannelLayout>
		<div class="w-full p-5">{{ channels }}</div>
	</ChannelLayout>
</template>