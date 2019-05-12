<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
	<nav class="squireToolbar-container menu">
		<div class="squireToolbar">
			<div v-for="action in actions" v-show="editorMode === mimeTypes.HTML" :key="action.name">
				<button
					v-if="action.type === 'button'"
					:class="action.isActive ? action.name : ''"
					type="button"
					@click="onAction(action)"
				>
					<font-awesome-icon :icon="action.icon" />
				</button>
				<select v-else-if="action.type === 'select'" v-model="action.current" @change="onAction(action)">
					<option v-for="option in action.options" :key="option.value" :value="option">
						{{ option.key }}
					</option>
				</select>
				<div v-else-if="action.type === 'separator'" class="squireToolbar-separator"></div>
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
import {
	faAlignLeft,
	faAlignCenter,
	faAlignRight,
	faBold,
	faEraser,
	faFont,
	faImage,
	faItalic,
	faLink,
	faListUl,
	faListOl,
	faQuoteRight,
	faRedoAlt,
	faUnderline,
	faUndoAlt,
} from '@fortawesome/free-solid-svg-icons/index'

import Modal from './Modal'
import LinkContent from './LinkContent'

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
			actions: [
				{
					name: 'fontSize',
					type: 'select',
					current: {key: 14, value: '14px'},
					options: [
						{key: 10, value: '10px'},
						{key: 12, value: '12px'},
						{key: 14, value: '14px'},
						{key: 16, value: '16px'},
						{key: 18, value: '18px'},
						{key: 20, value: '20px'},
						{key: 22, value: '22px'},
						{key: 24, value: '24px'},
						{key: 26, value: '26px'},
					],
				},
				{
					name: 'fontFace',
					type: 'select',
					current: {key: 'Arial', value: 'arial'},
					options: [
						{key: 'Georgia', value: 'georgia'},
						{key: 'Arial', value: 'arial'},
						{key: 'Helvetica', value: 'helvetica'},
						{key: 'Monospace', value: 'menlo, consolas, courier new, monospace'},
						{key: 'Tahoma', value: 'tahoma, sans-serif'},
						{key: 'Verdana', value: 'verdana'},
						{key: 'Times New Roman', value: 'times new roman'},
						{key: 'Trebuchet MS', value: 'trebuchet ms'},
					],
				},

				{type: 'separator'},

				{name: 'bold', type: 'button', icon: faBold, format: 'B', isActive: false},
				{name: 'italic', type: 'button', icon: faItalic, format: 'I', isActive: false},
				{name: 'underline', type: 'button', icon: faUnderline, format: 'U', isActive: false},

				{type: 'separator'},

				{name: 'unorderedList', type: 'button', icon: faListUl, format: 'UL', isActive: false},
				{name: 'orderedList', type: 'button', icon: faListOl, format: 'OL', isActive: false},

				{type: 'separator'},

				// TODO: makeLink
				{name: 'link', type: 'button', icon: faLink, format: 'A', isActive: false},
				// TODO: insertImage
				{name: 'image', type: 'button', icon: faImage, format: 'IMG', isActive: false},

				{type: 'separator'},

				{
					name: 'alignLeft',
					type: 'button',
					icon: faAlignLeft,
					format: 'DIV.align-left',
					isActive: false,
					value: 'left',
				},
				{
					name: 'alignCenter',
					type: 'button',
					icon: faAlignCenter,
					format: 'DIV.align-center',
					isActive: false,
					value: 'center',
				},
				{
					name: 'alignRight',
					type: 'button',
					icon: faAlignRight,
					format: 'DIV.align-right',
					isActive: false,
					value: 'right',
				},

				{type: 'separator'},

				{name: 'quote', type: 'button', icon: faQuoteRight, format: 'BLOCKQUOTE', isActive: false},

				{type: 'separator'},

				{name: 'undo', type: 'button', icon: faUndoAlt},
				{name: 'redo', type: 'button', icon: faRedoAlt},
				{type: 'separator'},

				{name: 'eraser', type: 'button', icon: faEraser},

				{type: 'separator'},

				// TODO: color picker for font and background
				{name: 'color', type: 'button', icon: faFont, format: 'A', isActive: false},
			],
		}
	},
	computed: {
		formats() {
			const formats = []

			this.actions.forEach(action => {
				if (action.type === 'button' && action.hasOwnProperty('format')) {
					formats.push(action.format)
				}
			})

			return formats
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
		const fontSize = this.actions.find(action => action.name === 'fontSize').current.value
		const fontFace = this.actions.find(action => action.name === 'fontFace').current.value

		this.editor.setFontSize(`${fontSize}`)
		this.editor.setFontFace(`${fontFace}`)

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
					return action.current.value
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

			if (path !== '(selection)') {
				// only deal with tags that we use
				const activeTags = path.split('>').filter(tag => this.formats.includes(tag))

				this.actions.forEach(action => {
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

.squireToolbar-container button.alignLeft,
.squireToolbar-container button.alignCenter,
.squireToolbar-container button.alignRight,
.squireToolbar-container button.bold,
.squireToolbar-container button.italic,
.squireToolbar-container button.underline,
.squireToolbar-container button.unorderedList,
.squireToolbar-container button.orderedList,
.squireToolbar-container button.quote {
	background: rgba(0, 0, 0, 0.3);
}
</style>
