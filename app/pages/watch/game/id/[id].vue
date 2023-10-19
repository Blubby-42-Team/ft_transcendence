<script lang="ts" setup>
const route = useRoute()

const { gameList } = useGameListStore();

</script>

<template>
	<div class="p-5">
		<div class="flex">
			<GenericNuxtLink to="/watch" :buttonStyle="1" class="h-10">
				<Icon name="material-symbols:arrow-back-ios-new-rounded" class="w-full h-full"/>
			</GenericNuxtLink>
			<GenericButton :buttonStyle="1" class="h-10 pl-1 pr-1">
				Update Event
			</GenericButton>
			<GenericButton :buttonStyle="1" class="h-10 pl-1 pr-1">
				Delete Event
			</GenericButton>
		</div>
		<div class="flex mt-5 mb-5 border-2 border-text"></div>
		<div>
			<div>{{ route.params.id }}</div>
		</div>
	</div>
</template>