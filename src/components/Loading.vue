<template>
	<div v-if="hint" class="emptycontent">
		<a class="icon-loading"></a>
		<h2>{{ hint }}</h2>
		<transition name="fade">
			<em v-if="slowHint && slow">{{ slowHint }}</em>
		</transition>
	</div>
	<div v-else class="container icon-loading"></div>
</template>

<script>
export default {
	name: 'Loading',
	props: {
		hint: {
			type: String,
			default: '',
			required: false,
		},
		slowHint: {
			type: String,
			default: '',
			required: false,
		},
	},
	data() {
		return {
			slow: false,
			slowTimer: undefined,
		}
	},
	mounted() {
		clearTimeout(this.slowTimer)

		this.slowTimer = setTimeout(() => {
			this.slow = true
		}, 3500)
	},
	beforeDestroy() {
		clearTimeout(this.slowTimer)
	},
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
