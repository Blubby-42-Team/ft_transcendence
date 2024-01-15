<script lang="ts" setup>

definePageMeta({name: 'Message'})
const { setSelectedCategory } = usePageStore();
onMounted(() => { setSelectedCategory(EPageCategories.MESSAGES); })

const { fetchChannelList, selectChannel } = useChannelStore();
const userStore = useUserStore();
const { primaryUser } = storeToRefs(userStore);

await fetchChannelList(primaryUser.value.id);
await selectChannel(primaryUser.value.id, 0);
</script>

<template>
	<ChannelLayout>
		<div class="p-5">
			Is this page empty ? Use the
			<Icon class="w-8 h-8" name="material-symbols:search"/>
			to search for new channels !
		</div>
	</ChannelLayout>
</template>