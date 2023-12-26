<script lang="ts" setup>

const { selectChannel, selectedChannel, channels } = useChannelStore()

const types = useState<Array<channelTypeSettings>>('channelTypes');

</script>

<template>
	<div class="w-full h-auto overflow-x-hidden scrollbar scrollbar-w-0 bg-background1">
		<template v-for="ctype in types">			
			<GenericButton class="w-full h-12 p-2 text-lg place-content-start" :buttonStyle="2"
				:selected="ctype.type === selectedChannel?.type ?? undefined"
				@click="ctype.open = !ctype.open"
			>
				<Icon :name="ctype.icon" class="w-10 h-10"/>
				<div class="pl-2">{{ ctype.name }}</div>
			</GenericButton>

			<div class="border-b-[1px] border-background2"></div>

			<TransitionExpand>
				<template v-if="ctype.open">
					<div>
						<template v-for="channel in channels.filter((elem) => elem !== undefined && elem?.type === ctype.type)">
							<GenericButton class="w-full px-3 py-1 place-content-start" :buttonStyle="2"
								:selected="channel?.id === selectedChannel?.id"
								@click="selectChannel(channel?.id ?? 0)"
							>
								<GenericProfilePicture class="w-10 h-10" imageSrc="/amogus.png"/>
								<div class="pl-2">{{ channel?.name }}</div>
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
</template>


