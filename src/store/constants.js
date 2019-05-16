/*
 * @copyright 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @author 2019 Christoph Wurst <christoph@winzerhof-wurst.at>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

export const UNIFIED_ACCOUNT_ID = 0
export const UNIFIED_INBOX_ID = btoa('inbox')
export const UNIFIED_INBOX_UID = UNIFIED_ACCOUNT_ID + '-' + UNIFIED_INBOX_ID

export const MIME_TYPES = {
	HTML: {type: 'text/html', name: 'HTML'},
	PLAIN: {type: 'text/plain', name: 'Text'},
}

export const FONT_SIZES = {
	10: '10px',
	12: '12px',
	14: '14px',
	16: '16px',
	18: '18px',
	20: '20px',
	22: '22px',
	24: '24px',
	26: '26px',
}

export const FONT_FACE_NAMES = {
	GEORGIA: 'Georgia',
	ARIAL: 'Arial',
	HELVETICA: 'Helvetica',
	MONOSPACE: 'Monospace',
	TAHOMA: 'Tahoma',
	VERDANA: 'Verdana',
	TIMES_NEW_ROMAN: 'Times New Roman',
	TREBUCHET_MS: 'Trebuchet MS',
}

export const FONT_FACES = {
	[FONT_FACE_NAMES.GEORGIA]: 'georgia',
	[FONT_FACE_NAMES.ARIAL]: 'arial',
	[FONT_FACE_NAMES.HELVETICA]: 'helvetica',
	[FONT_FACE_NAMES.MONOSPACE]: 'menlo, consolas, courier new, monospace',
	[FONT_FACE_NAMES.TAHOMA]: 'tahoma',
	[FONT_FACE_NAMES.VERDANA]: 'verdana',
	[FONT_FACE_NAMES.TIMES_NEW_ROMAN]: 'times new roman',
	[FONT_FACE_NAMES.TREBUCHET_MS]: 'trebuchet ms',
}

export const SQUIRE_ACTIONS = [
	[
		{name: 'fontSize', type: 'select', options: FONT_SIZES, selected: FONT_SIZES[14]},
		{name: 'fontFace', type: 'select', options: FONT_FACES, selected: FONT_FACES[FONT_FACE_NAMES.ARIAL]},
	],
	[
		{name: 'bold', type: 'button', icon: faBold, format: 'B', isActive: false},
		{name: 'italic', type: 'button', icon: faItalic, format: 'I', isActive: false},
		{name: 'underline', type: 'button', icon: faUnderline, format: 'U', isActive: false},
	],
	[
		{name: 'unorderedList', type: 'button', icon: faListUl, format: 'UL', isActive: false},
		{name: 'orderedList', type: 'button', icon: faListOl, format: 'OL', isActive: false},
	],
	[
		{name: 'link', type: 'button', icon: faLink, format: 'A', isActive: false},
		// TODO: insertImage
		{name: 'image', type: 'button', icon: faImage, format: 'IMG', isActive: false},
	],
	[
		{name: 'alignLeft', type: 'button', icon: faAlignLeft, format: 'DIV.align-left', isActive: false, value: 'left'},
		{name: 'alignCenter', type: 'button', icon: faAlignCenter, format: 'DIV.align-center', isActive: false, value: 'center'},
		{name: 'alignRight', type: 'button', icon: faAlignRight, format: 'DIV.align-right', isActive: false, value: 'right'},
	],
	[
		{name: 'quote', type: 'button', icon: faQuoteRight, format: 'BLOCKQUOTE', isActive: false},
	],
	[
		{name: 'undo', type: 'button', icon: faUndoAlt},
		{name: 'redo', type: 'button', icon: faRedoAlt},
	],
	[
		{name: 'eraser', type: 'button', icon: faEraser},
	],
	[
		// TODO: color picker for font and background
		{name: 'color', type: 'button', icon: faFont, format: 'A', isActive: false},
	],
]
