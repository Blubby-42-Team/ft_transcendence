<script setup lang="ts">

const notifStore = useNotifStore();
const { notif } = storeToRefs(notifStore);

</script>

<template>
	<div class="absolute right-0 overflow-hidden top-16 h-max w-96">
		<template v-for="noti in notif.slice(-3)">
			<div class="h-24 px-2 pb-2 w-96">
				<div class="grid w-full h-full grid-cols-[auto,2rem] grid-rows-[2rem,auto] bg-background1 border-text hover:bg-background2 hover:border-text p-2 border rounded-xl"
					@click="notifStore.executeNotif(noti.id)"
				>
					<div class="row-[1_/_3] col-[1_/_3] break-all overflow-hidden">{{ noti.message }}</div>
					<GenericButton class="w-full h-full row-[1] col-[2] rounded-xl bg-background1" :buttonStyle="2"
						@click="notifStore.deleteNotif(noti.id)"
					>
						<Icon class="w-full h-full row-[1] col-[2]" name="material-symbols:close"/>
					</GenericButton>
				</div>
			</div>
		</template>
	</div>
</template>
