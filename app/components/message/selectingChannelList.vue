<script lang="ts" setup>

const { channels, channelType, selectedChannel, selectedChannelMenu, selectChannelMenu, updateSelectedChannel } = useChannelListStore()

</script>

<template>
	<div class="bg-background1">
		<div class="flex flex-col h-full">
			<template v-for="ctype in channelType">			
				<GenericButton class="w-full h-12 p-2 text-lg place-content-start" :buttonStyle="2"
					@click="selectChannelMenu(ctype.type)"
				>
					<Icon :name="ctype.icon" class="w-10 h-10"/>
					<div class="pl-2">{{ ctype.name }}</div>
				</GenericButton>
	
				<!-- <div class="border-b-[1px] border-background2"></div> -->
	
				<TransitionExpand>
					<template v-if="ctype.type === selectedChannelMenu">
						<div class="overflow-auto overflow-x-hidden scrollbar">
							<template v-for="channel in channels.filter((elem) => elem.type === ctype.type)">
								<GenericButton class="w-full px-3 py-1 place-content-start" :buttonStyle="2" :selected="channel.id === selectedChannel?.id"
									@click="() => updateSelectedChannel(channel.id)"
								>
									<GenericProfilePicture class="w-10 h-10" imageSrc="/amogus.png"/>
									<div class="pl-2">{{ channel.name }}</div>
								</GenericButton>
							</template>
							<template v-if="ctype.hasBottom">
								<!-- <div class="pb-4 border-b-[1px] border-background2"></div> -->
							</template>
						</div>
					</template>
				</TransitionExpand>
			</template>
		</div>
	</div>
</template>


