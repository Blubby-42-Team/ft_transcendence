<script lang="ts" setup>
const isMembersOpen		= useState('isMembersOpen');
const { members } = useChannelStore()

</script>

<template>
	<div class="h-full" :class="(isMembersOpen ? 'w-60' : '')">
		<div class="flex p-2 bg-color1">
			<template v-if="isMembersOpen">
				<div class="flex self-center mr-auto text-3xl place-items-center">Members</div>
			</template>
			<GenericButton :buttonStyle="1" class="self-center w-12 h-12 mr-0"
				@click="() => { isMembersOpen = !isMembersOpen }"
			>
				<Icon name="material-symbols:menu" class="w-full h-full"/>
			</GenericButton>
		</div>

		<div class="h-full overflow-x-hidden bg-color2 scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-text scrollbar-thumb-rounded-none scrollbar-track">
			<template v-for="member in members">
				<div class="flex p-2">
					<GenericProfilePicture class="w-10 h-10" imageSrc="/amogus.png"/>
					<template v-if="isMembersOpen">
						<div class="flex">
							{{ member.name }}
						</div>
					</template>
				</div>
			</template>
		</div>

	</div>
</template>


