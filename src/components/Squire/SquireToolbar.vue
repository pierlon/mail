<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<nav class="squireToolbar-container menu">
		<div class="squireToolbar">
			<div
				class="squireToolbar"
				v-for="(actionGroup, idx) in actions"
				v-show="editorMode === mimeTypes.HTML"
				:key="idx"
			>
				<div v-for="action in actionGroup" :key="action.name">
					<button
						v-if="action.type === 'button'"
						:class="action.isActive ? action.name : ''"
						type="button"
						@click="onAction(action)"
					>
						<font-awesome-icon :icon="action.icon" />
					</button>
					<select v-else-if="action.type === 'select'" v-model="action.selected" @change="onAction(action)">
						<option v-for="(option, key) in action.options" :key="key" :value="option">
							{{ key }}
						</option>
					</select>
				</div>

				<div v-if="idx < actions.length - 1" class="squireToolbar-separator"></div>
			</div>

			<select v-model="mimeType" class="mode" @change="onMode">
				<option v-for="(mime, key) in mimeTypes" :key="key" :value="mime">{{ mime.name }}</option>
			</select>
		</div>

		<modal :title="linkModal.title" :visible.sync="linkModal.enabled">
			<link-content :url.sync="linkUrl" />

			<template v-slot:actions>
				<button
					v-for="(action, key) in linkModal.actions"
					:key="key"
					class="primary"
					:disabled="action.disabled"
					@click="action.onClick"
				>
					{{ upperFirst(key) }}
				</button>
			</template>
		</modal>
	</nav>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import {upperFirst} from 'lodash'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome/index'

import Modal from './Modal'
import LinkContent from './LinkContent'
import {SQUIRE_ACTIONS} from '@/store/constants'

export default {
	name: 'SquireToolbar',
	components: {
		FontAwesomeIcon,
		Modal,
		LinkContent,
	},
	props: {
		editor: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			mimeType: null,
			linkUrl: '',
			linkModal: {
				enabled: false,
				title: 'Insert Link',
				actions: {
					remove: {
						disabled: true,
						onClick: this.onRemoveLink,
					},
					insert: {
						disabled: true,
						onClick: this.onInsertLink,
					},
				},
			},
			actions: SQUIRE_ACTIONS,
		}
	},
	computed: {
		fontSize() {
			return this.flattenedActions.find(action => action.name === 'fontSize')
		},
		fontFace() {
			return this.flattenedActions.find(action => action.name === 'fontFace')
		},
		flattenedActions() {
			return this.actions.reduce((a, b) => a.concat(b))
		},
		...mapState(['mimeTypes']),
		...mapGetters({
			editorMode: 'getEditorMode',
		}),
	},
	watch: {
		linkUrl(val) {
			this.linkModal.actions.insert.disabled = val === ''
		},
	},
	created() {
		this.mimeType = this.editorMode
	},
	mounted() {
		this.editor.setFontSize(this.fontSize.selected)
		this.editor.setFontFace(this.fontFace.selected)

		this.setPathListener()
	},
	methods: {
		onAction(action) {
			if (this.shouldToggleModal(action.name)) {
				this[`show${upperFirst(action.name)}Modal`]()
			} else {
				const method = this.getEditorMethod(action)
				const value = this.getActionValue(action)

				this.editor[method](value)
			}
		},
		shouldToggleModal(action) {
			const actions = ['link']

			return actions.includes(action)
		},
		getEditorMethod({name, type, isActive = false}) {
			switch (true) {
				case /^(un)?orderedList$/.test(name):
					return isActive ? 'removeList' : `make${upperFirst(name)}`
				case /^align(Left|Center|Right)$/.test(name):
					return 'setTextAlignment'
				case name === 'quote':
					return isActive ? 'decreaseQuoteLevel' : 'increaseQuoteLevel'
				case type === 'select':
					return `set${upperFirst(name)}`
				case name === 'eraser':
					return 'removeAllFormatting'
				default:
					return isActive ? `remove${upperFirst(name)}` : name
			}
		},
		getActionValue(action) {
			switch (true) {
				case action.type === 'select':
					return action.selected
				case /^align(Left|Center|Right)$/.test(action.name):
					return action.value
				default:
					return null
			}
		},
		setPathListener() {
			this.editor.addEventListener('pathChange', this.onPathChange)
		},
		showLinkModal() {
			this.linkUrl = this.getSelectedLink()

			this.linkModal.actions.remove.disabled = this.linkUrl === ''

			this.linkModal.enabled = true
		},
		getSelectedLink() {
			let node = this.editor.getSelection().startContainer.parentNode

			while (node !== null) {
				if (node.tagName === 'A') {
					return node.href
				}

				node = node.parentNode
			}

			return ''
		},
		onInsertLink() {
			this.linkModal.enabled = false
			this.editor.makeLink(this.linkUrl, {
				target: '_blank',
				title: this.linkUrl,
				rel: 'nofollow',
			})
		},
		onRemoveLink() {
			this.linkModal.enabled = false
			this.editor.removeLink()
		},
		onPathChange() {
			const path = this.editor.getPath()
			const fontInfo = this.editor.getFontInfo()

			if (path !== '(selection)') {
				if (fontInfo.size !== undefined) {
					this.fontSize.selected = fontInfo.size
				}

				if (fontInfo.family !== undefined) {
					this.fontFace.selected = /(.+), sans-serif/.exec(fontInfo.family)[1].replace(/"/g, '')
				}

				const activeTags = path.split('>').filter(tag => {
					return /^BLOCKQUOTE$|^I$|^U$|^B$|^UL$|^OL$|^LI$|.align-(center|left|right)$/.test(tag)
				})

				this.flattenedActions.forEach(action => {
					action.isActive = activeTags.includes(action.format)
				})
			}
		},
		onMode() {
			this.$store.commit('editorMode', this.mimeType)

			if (this.mimeType === this.mimeTypes.HTML) this.editor.focus()
		},
		upperFirst,
	},
}
</script>

<style scoped>
.squireToolbar {
	display: flex;
}

.squireToolbar select.mode {
	min-width: auto;
	margin-left: auto;
	margin-right: 0.5em;
	display: flex;
	position: relative;
	min-height: 34px;
}

.squireToolbar-separator {
	width: 1px;
	height: 34px;
	margin: 2px 3px;
	background: #acb0bf;
}

button.alignLeft,
button.alignCenter,
button.alignRight,
button.bold,
button.italic,
button.underline,
button.unorderedList,
button.orderedList,
button.quote {
	background: rgba(0, 0, 0, 0.3);
}
</style>
