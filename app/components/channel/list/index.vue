<script lang="ts" setup>

import { EChatType, IShortChannel } from "#imports"

const { selectedChannel, channels, activeType } = useChannelStore()

</script>

<template>
	<div class="w-full h-full overflow-x-hidden scrollbar scrollbar-w-0 bg-background1">
		<template v-for="ctype in channels" :key="ctype.name">
			<template v-if="ctype.channels && ctype.channels.length > 0">
				<div class="border-b-[1px] border-background2"></div>
				
				<GenericButton class="w-full h-12 p-2 text-lg place-content-start" :buttonStyle="2"
					:selected="selectedChannel?.id !== 0 && activeType?.name === ctype?.name"
					@click="ctype.open = !ctype.open"
				>
					<Icon :name="ctype.icon" class="w-10 h-10"/>
					<div class="pl-2">{{ ctype.name }}</div>
				</GenericButton>
	
				<div class="border-b-[1px] border-background2"></div>
	
				<TransitionExpand>
					<template v-if="ctype.open">
						<div class="pb-4">
							<template v-for="channel in ctype.channels" :key="channel?.id ?? 0">
								<GenericNuxtLink class="w-full px-3 py-1 place-content-start" :buttonStyle="2"
									:selected="(channel?.id === selectedChannel?.id)"
									:to="`/messages/${channel?.id ?? 0}`"
								>
									<GenericProfilePicture class="w-10 h-10" :imageSrc="channel?.avatar ?? '/pp.png'"/>
									<div class="pl-2">{{ channel?.name }}</div>
								</GenericNuxtLink>
							</template>
						</div>
					</template>
				</TransitionExpand>
			</template>
		</template>
		{{ activeType }}
	</div>
</template>


