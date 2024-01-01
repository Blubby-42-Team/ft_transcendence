<script setup lang="ts">

const notif = useState<Array<{ id: number, message: string }>>('notif', () => [])

function deleteNotif(id: number) {
	notif.value = notif.value.filter((value) => value.id !== id);
}

function executeNotif(id: number) {
	console.log(id);
}

</script>

<template>
	<div class="absolute top-0 right-0 pt-[4.5rem] h-max w-96 overflow-hidden">
		<template v-for="noti in notif.slice(-3)">
			<div class="h-24 px-2 pb-2 w-96">
				<div class="grid w-full h-full grid-cols-[auto,2rem] grid-rows-[2rem,auto] bg-background1 border-background1 hover:bg-background2 hover:border-text p-2 border rounded-xl"
					@click="executeNotif(noti.id)"
				>
					<div class="row-[1_/_3] col-[1_/_3] break-all overflow-hidden">{{ noti.message }}</div>
					<GenericButton class="w-full h-full row-[1] col-[2] rounded-xl bg-background1" :buttonStyle="2"
						@click="deleteNotif(noti.id)"
					>
						<Icon class="w-full h-full row-[1] col-[2]" name="material-symbols:close"/>
					</GenericButton>
				</div>
			</div>
		</template>
	</div>
</template>
