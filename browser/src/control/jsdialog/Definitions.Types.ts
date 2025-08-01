/* -*- js-indent-level: 8 -*- */
/*
 * Copyright the Collabora Online contributors.
 *
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Definitions.Types - types and interfaces for JSDialog
 */

// common for all widgets
interface WidgetJSON {
	id: string; // unique id of a widget
	type: string; // type of widget
	enabled?: boolean; // enabled state
	visible?: boolean; // visibility state
	children: Array<WidgetJSON>; // child nodes
	title?: string;
	top?: string; // placement in the grid - row
	left?: string; // placement in the grid - column
	width?: string; // inside grid - width in number of columns
	labelledBy?: string;
	allyRole?: string;
}

interface JSBuilderOptions {
	cssClass: string; // class added to every widget root
	windowId: number; // window id to be sent with dialogevent
	map: any; // reference to map
	mobileWizard: any; // reference to the parent container	FIXME: rename
	useSetTabs: boolean; // custom tabs placement handled by the parent container
	useScrollAnimation: boolean; // do we use animation for scrollIntoView

	// modifiers
	noLabelsForUnoButtons: boolean; // create only icon without label
	useInLineLabelsForUnoButtons: boolean; // create labels next to the icon
}

interface JSBuilder {
	_currentDepth: number; // mobile-wizard only FIXME: encapsulate
	_controlHandlers: any; // handlers for widget types

	options: JSBuilderOptions; // current state
	map: any; // reference to map
	rendersCache: any; // on demand content cache

	build: (
		parentContainer: Element,
		data: WidgetJSON[],
		hasVerticalParent: boolean,
	) => boolean;
	updateWidget: (parentContainer: Element, updateJSON: any) => void;
	executeAction: (parentContainer: Element, actionJSON: any) => void;
	callback: JSDialogCallback;
	postProcess: (parentContainer: Element, data: WidgetJSON) => void;

	// helpers FIXME: put as local in Control.Containers.ts
	_getGridColumns: (data: WidgetJSON[]) => number;
	_getGridRows: (data: WidgetJSON[]) => number;
	_preventDocumentLosingFocusOnClick: (container: Element) => void;
	_cleanText: (text: string) => string;
	_expanderHandler: any; // FIXME: use handlers getter instead
}

interface DialogResponse {
	id: string;
	response: number;
}

interface DialogJSON extends WidgetJSON {
	dialogid: string; // unique id for a dialog type, not instance
	responses?: Array<DialogResponse>;
}

// JSDialog message (full, update or action)
interface JSDialogJSON extends DialogJSON {
	id: string; // unique windowId
	jsontype: string; // specifies target component, on root level only
	action?: string; // optional name of an action
	control?: WidgetJSON;
}

// JSDialog message for popup
interface PopupData extends JSDialogJSON {
	isAutoCompletePopup?: boolean;
	isAutoFillPreviewTooltip?: boolean;
	cancellable?: boolean;
	hasClose: boolean;
	noOverlay: boolean;
	popupParent?: string;
	clickToClose?: string;
	persistKeyboard?: boolean;
	posx: number;
	posy: number;
}

// callback triggered by user actions
type JSDialogCallback = (
	objectType: string,
	eventType: string,
	object: any,
	data: any,
	builder: JSBuilder,
) => void;

// callback triggered for custom rendered entries
type CustomEntryRenderCallback = (pos: number | string) => void;

// used to define menus
type MenuDefinition = {
	id?: string; // unique identifier
	type: 'action' | 'menu' | 'separator' | 'html' | 'json'; // type of entry
	text?: string; // displayed text
	hint?: string; // hint text
	uno?: string; // uno command
	action?: string; // dispatch command
	htmlId?: string; // DEPRECATED: id of HTMLContent - used in html type
	content?: Array<WidgetJSON>; // custom content - used in json type
	img?: string; // icon name
	icon?: string; // icon name FIXME: duplicated property, used in exportMenuButton
	checked?: boolean; // state of check mark
	items?: Array<any>; // submenu
};

interface ContainerWidgetJSON extends WidgetJSON {
	layoutstyle?: string | 'start' | 'end'; // describes alignment of the elements
	vertical?: boolean; // is horizontal or vertical container
}

interface GridWidgetJSON extends ContainerWidgetJSON {
	cols: number; // number of grid columns
	rows: number; // numer of grid rows
}

interface ToolboxWidgetJSON extends WidgetJSON {
	hasVerticalParent: boolean;
}

interface PanelWidgetJSON extends WidgetJSON {
	hidden: boolean; // is hidden
	command: string; // command to trigger options for a panel
	text: string; // panel title
	name?: string; // legacy panel id
}

type ExpanderWidgetJSON = any;

// type: 'fixedtext'
interface TextWidget extends WidgetJSON {
	text: string;
	labelFor?: string;
}

// type: 'pushbutton'
interface PushButtonWidget extends WidgetJSON {
	symbol?: string;
	text?: string;
}

// type: 'buttonbox'
interface ButtonBoxWidget extends WidgetJSON {
	layoutstyle: string;
}

// type: 'listbox'
interface ListBoxWidget extends WidgetJSON {
	entries: Array<string>;
}

interface TreeColumnJSON {
	text?: any;
	link?: string;
	collapsed?: string | boolean;
	expanded?: string | boolean;
	customEntryRenderer?: boolean; // has custome rendering enabled
	collapsedimage?: string;
	expandedimage?: string;
	editable?: boolean;
}

interface TreeEntryJSON {
	row: number | string; // unique id of the entry
	text: string; // deprecated: simple text for an entry
	state: boolean; // checked radio/checkbox or not
	enabled: boolean; // enabled entry or not
	selected: boolean; // is entry selected
	collapsed: boolean; // is entry collapsed
	ondemand: boolean; // has content to request
	columns: Array<TreeColumnJSON>; // entry data
	children: Array<TreeEntryJSON>;
}

interface TreeHeaderJSON {
	text: string;
	sortable: boolean; // can be sorted by column
}

interface TreeWidgetJSON extends WidgetJSON {
	text: string;
	singleclickactivate: boolean; // activates element on single click instead of just selection
	fireKeyEvents?: boolean; // do we sent key events to core
	hideIfEmpty?: boolean; // hide the widget if no entries available
	checkboxtype: string; // radio or checkbox
	draggable?: boolean; // indicates if we can drag entries to another treeview
	entries: Array<TreeEntryJSON>;
	headers: Array<TreeHeaderJSON>; // header columns
}

interface IconViewEntry {
	row: number | string; // unique id of the entry
	separator: boolean; // is separator
	selected: boolean; // is currently selected
	image: string; // base64 encoded image
	text: string; // label of an entry
	tooltip: string; // tooltip of an entry
	ondemand: boolean; // if true then we ignore image property and request it on demand (when shown)
}

interface IconViewJSON extends WidgetJSON {
	entries: Array<IconViewEntry>;
	singleclickactivate: boolean; // activates element on single click instead of just selection
	textWithIconEnabled: boolean; // To identify if we should add text below the icon or not.
}

interface EditWidgetJSON extends WidgetJSON {
	placeholder: string; // show when empty
	text: string; // text value
	password: boolean; // is password field
	hidden: boolean; // is hidden, TODO: duplicate?
	changedCallback: any; // callback  for 'change' event
}
