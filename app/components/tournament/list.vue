<script setup lang="ts">

const { tournaments } = useTournamentListStore();

</script>

<template>
	<div class="grid grid-cols-[8em,auto]">
		<div class="contents">
			<div class="p-2 text-center bg-pink-500">Attendance</div>
			<div class="p-2 bg-pink-500">Tournament Name</div>
		</div>
		<template v-for="(tournament, i) in tournaments">
			<NuxtLink :to="`/tournament/id/${tournament.id}`" class="contents group">
				<div class="p-2 text-center bg-pink-500 group-hover:bg-pink-500 group-hover:bg-opacity-75" :class="i % 2 ? 'bg-opacity-70' : ''">{{tournament.attendance}}/{{tournament.maxAttendance}}</div>
				<div class="p-2 break-all bg-pink-500 group-hover:bg-pink-500 group-hover:bg-opacity-75" :class="i % 2 ? 'bg-opacity-70' : ''">{{ tournament.name }}</div>
			</NuxtLink>
		</template>
	</div>
</template>
