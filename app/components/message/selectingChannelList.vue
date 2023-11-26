<script lang="ts" setup>

const isSideMenuOpen		= useState('isSideMenuOpen');
const hasSideMenu			= useState('hasSideMenu');
const selectedChannelName	= useState('selectedChannelName');
const channelTypes			= useState('channels')

</script>

<template>
	<div class="grid h-full grid-rows-[max-content_auto] bg-background1">
		<div class="h-16 bg-first"></div>
		<div class="top-0 h-auto overflow-x-hidden scrollbar scrollbar-w-0">
			<template v-for="channeltype in channelTypes">			
				<GenericButton class="w-full h-12 p-2 text-lg place-content-start" :buttonStyle="2"
					@click="() => { channeltype.open = !channeltype.open }"
				>
					<Icon :name="channeltype.icon" class="w-10 h-10"/>
					<div class="pl-2">{{ channeltype.name }}</div>
				</GenericButton>
	
				<div class="border-b-[1px] border-background2"></div>
	
				<TransitionExpand>
					<template v-if="channeltype.open">
						<div>
							<template v-for="channel in channeltype.channels">
								<GenericButton class="w-full px-3 py-1 place-content-start" :buttonStyle="2"
									@click="() => {
										hasSideMenu = channeltype.hasSideMenu;
										selectedChannelName = channel;
									}"
								>
									<GenericProfilePicture class="w-10 h-10" imageSrc="/amogus.png"/>
									<div class="pl-2">{{ channel }}</div>
								</GenericButton>
							</template>
						</div>
					</template>
				</TransitionExpand>
	
				<TransitionExpand>
					<template v-if="channeltype.hasBottom && channeltype.open">
						<div class="pb-4 border-b-[1px] border-background2"></div>
					</template>
				</TransitionExpand>
			</template>
		</div>
	</div>
</template>


