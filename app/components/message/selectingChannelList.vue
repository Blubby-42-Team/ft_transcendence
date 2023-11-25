<script lang="ts" setup>
const isGroupSelected	= useState('isGroupSelected');
const isGroupsOpen		= useState('isGroupsOpen');
const isChatsOpen		= useState('isChatsOpen');
const isFriendsOpen		= useState('isFriendsOpen');

</script>

<template>
	<div class="h-full overflow-x-hidden bg-pink-500 scrollbar scrollbar-w-2 scrollbar-h-2 scrollbar-thumb-pink-500 scrollbar-thumb-rounded-none scrollbar-track">
		<!-- Friends Hiding Button -->
		<GenericButton class="w-full h-12 text-lg place-content-start" :buttonStyle="2"
			@click="() => { isChatsOpen = !isChatsOpen }"
		>
			<Icon name="material-symbols:person" class="w-10 h-10"/>
			<div class="pl-2">Chats</div>
		</GenericButton>

		<div class="border-b-[1px] border-pink-500"></div>

		<!-- Friends List -->
		<TransitionExpand>
			<template v-if="isChatsOpen">
				<div class="p-1">
					<template v-for="i in 10">
						<GenericButton class="w-full h-10 mb-2 rounded place-content-start" :buttonStyle="2"
							@click="() => isGroupSelected = false"
						>
							<GenericProfilePicture class="w-10 h-10 bg-pink-500" imageSrc="/amogus.png"/>
							<div class="pl-2">Chats {{ i }}</div>
						</GenericButton>
					</template>
				</div>
			</template>
		</TransitionExpand>

		<TransitionExpand>
			<template v-if="isChatsOpen">
				<div class="pb-4 border-b-[1px] border-pink-500"></div>
			</template>
		</TransitionExpand>
		
		<!-- Groups Hiding Button -->
		<GenericButton class="w-full h-12 text-lg place-content-start" :buttonStyle="2"
			@click="() => { isGroupsOpen = !isGroupsOpen }"
		>
			<Icon name="material-symbols:groups" class="w-10 h-10"/>
			<div class="pl-2">Groups</div>
		</GenericButton>

		<div class="border-b-[1px] border-pink-500"></div>

		<!-- Groups List -->
		<TransitionExpand>
			<template v-if="isGroupsOpen">
				<div class="p-1">
					<template v-for="i in 10">
						<GenericButton class="w-full h-10 mb-2 rounded place-content-start" :buttonStyle="2"
							@click="() => isGroupSelected = true"
						>
							<GenericProfilePicture class="w-10 h-10 bg-pink-500" imageSrc="/amogus.png"/>
							<div class="pl-2">Group {{ i }}</div>
						</GenericButton>
					</template>
				</div>
			</template>
		</TransitionExpand>
		
		<TransitionExpand>
			<template v-if="isGroupsOpen">
				<div class="pb-4 border-b-[1px] border-pink-500"></div>
			</template>
		</TransitionExpand>
		


		<!-- Friends Hiding Button -->
		<GenericButton class="w-full h-12 text-lg place-content-start" :buttonStyle="2"
			@click="() => { isFriendsOpen = !isFriendsOpen }"
		>
			<Icon name="material-symbols:person" class="w-10 h-10"/>
			<div class="pl-2">Friends</div>
		</GenericButton>

		<div class="border-b-[1px] border-pink-500"></div>

		<!-- Friends List -->
		<TransitionExpand>
			<template v-if="isFriendsOpen">
				<div class="p-1">
					<template v-for="i in 10">
						<GenericButton class="w-full h-10 mb-2 rounded place-content-start" :buttonStyle="2"
							@click="() => isGroupSelected = false"
						>
							<GenericProfilePicture class="w-10 h-10 bg-pink-500" imageSrc="/amogus.png"/>
							<div class="pl-2">Friend {{ i }}</div>
						</GenericButton>
					</template>
				</div>
			</template>
		</TransitionExpand>
	</div>
</template>


