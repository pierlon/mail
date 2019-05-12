<template>
	<transition name="fade">
		<div v-show="visible" class="modal-mask">
			<!-- Content wrapper -->
			<transition name="modal-in">
				<div
					:class="[`modal-wrapper--${size}`, spreadNavigation ? 'modal-wrapper--spread-navigation' : '']"
					class="modal-wrapper"
					@click.self="close"
				>
					<div class="modal-container">
						<div class="header">
							<h1 v-if="title != null">{{ title }}</h1>
						</div>

						<div class="content">
							<slot />
						</div>

						<div class="actions">
							<slot name="actions" />
						</div>
					</div>
				</div>
			</transition>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Modal',
	props: {
		title: {
			type: String,
			default: null,
		},
		visible: {
			type: Boolean,
			default: false,
		},
		spreadNavigation: {
			// TODO: whats this?
			type: Boolean,
			default: false,
		},
		size: {
			type: String,
			default: 'normal',
			validator: size => {
				return ['normal', 'large', 'full'].includes(size)
			},
		},
	},
	methods: {
		close() {
			this.$emit('update:visible', false)
		},
	},
}
</script>

<style scoped>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.92);
	display: block;
}

.modal-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
}

.modal-wrapper .modal-container {
	padding: 0;
	background-color: var(--color-main-background);
	border-radius: var(--border-radius-large);
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: transform 300ms ease;
	display: block;
}

.modal-wrapper:not(.modal-wrapper--large):not(.modal-wrapper--full) .modal-container {
	max-width: 900px;
	max-height: 80%;
}

.modal-wrapper--full .modal-container {
	max-width: 100%;
	max-height: 100%;
	border-radius: 0;
}

.modal-wrapper--large .modal-container {
	max-width: 70%;
	max-height: 90%;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 250ms;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.fade-visibility-enter,
.fade-visibility-leave-to {
	opacity: 0;
	visibility: hidden;
}

.modal-in-enter-active,
.modal-in-leave-active,
.modal-out-enter-active,
.modal-out-leave-active {
	transition: opacity 250ms;
}

.modal-in-enter,
.modal-in-leave-to,
.modal-out-enter,
.modal-out-leave-to {
	opacity: 0;
}

.modal-in-enter .modal-container,
.modal-in-leave-to .modal-container {
	transform: scale(0.9);
}

.modal-out-enter .modal-container,
.modal-out-leave-to .modal-container {
	transform: scale(1.1);
}
</style>
