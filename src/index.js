'use strict'

import Table from 'cli-table'

import defaultOptions from './options'
import * as util from './util'
import {
	TABLE_CELL_SPLIT,
	TABLE_ROW_WRAP,
	COLON_REPLACER,
	HARD_RETURN,
	BULLET_POINT
} from './constants'

export default class Renderer {
	constructor(options = {}, highlightOptions = {}) {
		this.opts = { ...defaultOptions, ...options }
		this.tab = this.opts.tab |> util.sanitizeTab
		this.tableSettings = this.opts.tableOptions
		this.emoji = this.opts.emoji ? util.insertEmojis : util.identity
		this.unescape = this.opts.unescape ? util.unescapeEntities : util.identity
		this.highlightOptions = highlightOptions

		// Pipes the given argument through the given functions
		this.transform = _ => _ |> this.emoji |> this.unescape |> util.undoColon
	}

	textLength(str) {
		return str.replace(/\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, "").length
	}

	text(text) {
		return text |> this.opts.text
	}

	code(code, lang) {
		return util.section(util.indentify(
			util.sanitizeTab(this.opts.tab),
			util.highlight(code, lang, this.opts, this.highlightOptions)
		))
	}

	blockquote(quote) {
		return util.sanitizeTab(this.opts.tab)
			|> (_ => util.indentify(_, quote.trim()))
			|> this.opts.blockquote
			|> util.section
	}

	html(html) {
		return html |> this.opts.html
	}

	heading(text, level) {
		text = text |> this.transform

		const prefix = this.opts.showSectionPrefix ? `${new Array(level + 1).join('#')} ` : ''
		text = `${prefix}${text}`
		if (this.opts.reflowText) {
			text = util.reflowText(text, this.opts.width, this.options.gfm)
		}

		return text |> (level === 1 ? this.opts.firstHeading : this.opts.heading) |> util.section
	}

	hr() {
		const length = this.opts.reflowText && this.opts.width ? this.opts.reflowText && this.opts.width : undefined
		return util.hr('-', length) |> this.opts.hr |> util.section
	}

	list(body, ordered) {
		body = this.opts.list(body, ordered, this.tab)
		return util.indentLines(this.tab, body)
			|> (_ => util.fixNestedLists(_, this.tab))
			|> util.section
	}

	listitem(text) {
		if (text.includes('\n')) text = text.trim();

		text = text |> this.transform |> this.opts.listitem
		// Use BULLET_POINT as a marker for ordered or unordered list item
		return `\n${BULLET_POINT}${text}`
	}

	paragraph(text) {
		text = text |> this.transform |> this.opts.paragraph

		if (this.opts.reflowText) {
			text = util.reflowText(text, this.opts.width, this.options.gfm)
		}
		return text |> util.section
	}

	table(header, body) {
		const table = new Table({ head: util.generateTableRow(header)[0], ...this.tableSettings })

		const rows = util.generateTableRow(body, this.transform)
		for (let row of rows) table.push(row);

		return table.toString() |> this.opts.table |> util.section
	}

	tablerow(content) {
		return `${TABLE_ROW_WRAP}${content}${TABLE_ROW_WRAP}\n`
	}

	tablecell(content, flags) {
		return `${content}${TABLE_CELL_SPLIT}`
	}

	// span level renderer
	strong(text) {
		return text |> this.opts.strong
	}

	em(text) {
		return util.fixHardReturn(text, this.opts.reflowText) |> this.opts.em
	}

	codespan(text) {
		text = util.fixHardReturn(text, this.opts.reflowText)
		return this.opts.codespan(text.replace(/:/g, COLON_REPLACER))
	}

	br() {
		return this.opts.reflowText ? HARD_RETURN : '\n'
	}

	del(text) {
		return text |> this.opts.del
	}

	link(href, title, text) {
		if (this.options.sanitize) {
			let prot;
			try {
				prot = decodeURIComponent(this.unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
			} catch (e) {
				return '';
			}

			if (prot.startsWith('javascript:')) {
				return '';
			}
		}

		const hasText = text && text !== href

		if (hasText) {
			return this.opts.link(`${this.emoji(text)} (${this.opts.href(href)})`)
		} else {
			return this.opts.link(`${this.opts.href(href)}`)
		}
	}

	image(href, title, text) {
		return `![${text}${title ? ` – ${title}` : ''}](${href})\n`
	}
}
