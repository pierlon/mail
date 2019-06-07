<template>
	<div class="squire-container">
		<div class="editor-container">
			<SquireToolbar v-if="editor != null" :editor="editor" :plain-editor="$refs.plainEditor" />

			<textarea
				v-show="mode === MIME_TYPES.PLAIN"
				ref="plainEditor"
				class="message-body"
				:placeholder="t('mail', 'Message …')"
				@input="$emit('update:body', $event.target.value)"
				@keyup.ctrl.enter="$emit('send')"
			></textarea>
			<div v-show="mode === MIME_TYPES.HTML" class="squire-wrapper">
<!--				TODO: register key events-->
				<iframe ref="iframe" :tabindex="ignoreTab" class="message-body"></iframe>
			</div>
		</div>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
import Squire from 'squire-rte'

import SquireToolbar from './SquireToolbar'
import {MIME_TYPES} from '@/store/constants'
import iframeCss from '!!raw-loader!~/css/squire_iframe.css'

export default {
	name: 'Editor',
	components: {
		SquireToolbar,
	},
	props: {
		body: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			editor: null,
			MIME_TYPES,
		}
	},
	computed: {
		ignoreTab() {
			return this.mode === MIME_TYPES.PLAIN ? -1 : 0
		},
		sendKeys() {
			const ua = navigator.userAgent
			return (/Mac OS X/.test(ua) ? 'meta-' : 'ctrl-') + 'enter'
		},
		...mapGetters({
			mode: 'getEditorMode',
		}),
	},
	mounted() {
		this.create().then(this.onEditorLoaded)
	},
	methods: {
		create() {
			return new Promise((resolve, reject) => {
				try {
					this.loadIframe(this.$refs.iframe, iframe => {
						const iframeDoc = iframe.contentWindow.document
						this.addEditorCss(iframeDoc)

						resolve(new Squire(iframeDoc))
					})
				} catch (e) {
					console.error(e)
					reject(e)
				}
			})
		},
		loadIframe(iframe, callback) {
			const iframeDoc = (iframe.contentDocument || iframe.contentWindow) && iframe.contentWindow.document

			if (iframeDoc && iframeDoc.readyState === 'complete') {
				return callback(iframe)
			}

			iframe.addEventListener('load', () => callback(iframe))
		},
		addEditorCss(iframeDoc) {
			const head = iframeDoc.head || iframeDoc.getElementsByTagName('head')[0]
			const style = iframeDoc.createElement('style')

			style.setAttribute('type', 'text/css')
			style.setAttribute('rel', 'stylesheet')

			let _iframeCss = iframeCss

			if (OCA.Accessibility.theme === 'themedark') {
				const textColor = getComputedStyle(document.documentElement, null).getPropertyValue('--color-main-text')
				_iframeCss = iframeCss.replace('color: #222', `color: ${textColor}`)
			}

			if (style.styleSheet) {
				style.styleSheet.cssText = _iframeCss
			} else {
				style.appendChild(iframeDoc.createTextNode(_iframeCss))
			}

			head.appendChild(style)
		},
		onEditorLoaded(editor) {
			this.editor = editor
			this.setupListeners()
		},
		setupListeners() {
			this.editor.setKeyHandler(this.sendKeys, () => this.$emit('send'))
		},
	},
}
</script>

<style scoped>
.editor-container {
	display: flex;
	flex-direction: column;
}

.squire-container {
	padding: 12px;
	margin: 0;
	border-top: none;
	min-height: 300px;
	resize: none;
	flex-grow: 1;
}

/*TODO: .editor-container not taking full height*/

iframe.message-body {
	width: 100%;
}

textarea {
	max-width: none;
	border: none;
	border-radius: 0;
	width: auto;
}

textarea.reply {
	min-height: 100px;
}
</style>
