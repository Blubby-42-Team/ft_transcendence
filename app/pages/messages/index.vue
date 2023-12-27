<script lang="ts" setup>

definePageMeta({name: 'Message'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.MESSAGES); })


const { channels, fetchChannelList, selectChannel } = useChannelStore();
const { primaryUser } = useUserStore();
fetchChannelList(primaryUser.value.id);
selectChannel(0);
</script>

<template>
	<ChannelLayout>
		<div class="w-full p-5">{{ channels }}</div>
	</ChannelLayout>
</template>