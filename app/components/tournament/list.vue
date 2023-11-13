<script setup lang="ts">

const { tournaments } = useTournamentListStore();

</script>

<template>
	<div class="grid grid-cols-[8em,auto]">
		<div class="contents">
			<div class="p-2 text-center bg-color3">Attendance</div>
			<div class="p-2 bg-color3">Tournament Name</div>
		</div>
		<template v-for="(tournament, i) in tournaments">
			<NuxtLink :to="`/tournament/id/${tournament.id}`" class="contents group">
				<div class="p-2 text-center bg-color2 group-hover:bg-accent-color group-hover:bg-opacity-75" :class="i % 2 ? 'bg-opacity-70' : ''">{{tournament.attendance}}/{{tournament.maxAttendance}}</div>
				<div class="p-2 break-all bg-color2 group-hover:bg-accent-color group-hover:bg-opacity-75" :class="i % 2 ? 'bg-opacity-70' : ''">{{ tournament.name }}</div>
			</NuxtLink>
		</template>
	</div>
</template>
