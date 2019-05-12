<template>
	<div class="squire-container">
		<div class="editor-container">
			<div v-if="editor != null">
				<squire-toolbar :editor="editor" />
			</div>

			<textarea v-show="mode === mimeTypes.PLAIN"></textarea>
			<div v-show="mode === mimeTypes.HTML" class="squire-wrapper">
				<iframe ref="iframe" :tabindex="ignoreTab" class="message-body"></iframe>
			</div>
		</div>
	</div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import Squire from 'squire-rte'

import SquireToolbar from './SquireToolbar'
import iframeCss from '!!raw-loader!~/css/squire_iframe.css'

export default {
	name: 'SquireEditor',
	components: {
		SquireToolbar,
	},
	data() {
		return {
			editor: null,
		}
	},
	computed: {
		ignoreTab() {
			return this.mode === this.mimeTypes.PLAIN ? -1 : 0
		},
		...mapState(['mimeTypes']),
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

			if (style.styleSheet) {
				style.styleSheet.cssText = iframeCss
			} else {
				style.appendChild(iframeDoc.createTextNode(iframeCss))
			}

			head.appendChild(style)
		},
		onEditorLoaded(editor) {
			this.editor = editor
		},
	},
}
</script>

<style scoped>
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
</style>
