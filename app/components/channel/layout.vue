<script lang="ts" setup>

const { selectedChannel, fetchChannelList } = useChannelStore();
const { primaryUser } = useUserStore();
await fetchChannelList(primaryUser.value.id);

</script>

<template>
	<div class="grid h-full grid-rows-[4em_1fr_max-content] overflow-hidden grid-cols-[16em,1fr,auto]">
		<div class="h-16 col-span-3 p-2 text-lg bg-color1 text-text-light">
			<div class="flex items-center justify-center h-full ">
				{{ selectedChannel?.name }}
			</div>
		</div>

		<ChannelList class="row-[2_/_4] col-[1]"/>

		<slot/>

		<ChannelMembers class="row-[2_/_4] col-[3]"
			:members="selectedChannel?.members ?? []"
		/>
	</div>
</template>