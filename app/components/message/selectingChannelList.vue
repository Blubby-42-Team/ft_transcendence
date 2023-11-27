<script lang="ts" setup>

const { channels, channelType, updateSelectedChannel } = useChannelListStore()

</script>

<template>
	<div class="grid h-full grid-rows-[max-content_auto] bg-background1">
		<div class="h-16 bg-first"></div>
		<div class="top-0 h-auto overflow-x-hidden scrollbar scrollbar-w-0">
			<template v-for="ctype in channelType">			
				<GenericButton class="w-full h-12 p-2 text-lg place-content-start" :buttonStyle="2"
					@click="() => { ctype.open = !ctype.open }"
				>
					<Icon :name="ctype.icon" class="w-10 h-10"/>
					<div class="pl-2">{{ ctype.name }}</div>
				</GenericButton>
	
				<div class="border-b-[1px] border-background2"></div>
	
				<TransitionExpand>
					<template v-if="ctype.open">
						<div>
							<template v-for="channel in channels.filter((elem) => elem.type === ctype.type)">
								<GenericButton class="w-full px-3 py-1 place-content-start" :buttonStyle="2"
									@click="() => updateSelectedChannel(channel.id)"
								>
									<GenericProfilePicture class="w-10 h-10" imageSrc="/amogus.png"/>
									<div class="pl-2">{{ channel.name }}</div>
								</GenericButton>
							</template>
						</div>
					</template>
				</TransitionExpand>
	
				<TransitionExpand>
					<template v-if="ctype.hasBottom && ctype.open">
						<div class="pb-4 border-b-[1px] border-background2"></div>
					</template>
				</TransitionExpand>
			</template>
		</div>
	</div>
</template>


