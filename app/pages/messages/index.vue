<script lang="ts" setup>

definePageMeta({name: 'Message'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.MESSAGES); })


const { selectedChannel, channels, fetchChannelList } = useChannelStore();
const { primaryUser } = useUserStore();
fetchChannelList(primaryUser.value.id);

const isSideMenuOpen = useState<boolean>('isSideMenuOpen');

</script>

<template>
	<ChannelLayout>
		<div class="w-full p-5">{{ channels }}</div>
	</ChannelLayout>
</template>