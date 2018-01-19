'use strict'

import chalk from 'chalk'
import Table from 'cli-table'

import * as util from './util'
import {
	TABLE_CELL_SPLIT,
	TABLE_ROW_WRAP,
	COLON_REPLACER,
	HARD_RETURN,
	BULLET_POINT
} from './constants'

const defaultOptions = {
	code: chalk.yellow,
	blockquote: chalk.gray.italic,
	html: chalk.gray,
	heading: chalk.green.bold,
	firstHeading: chalk.magenta.underline.bold,
	hr: chalk.reset,
	listitem: chalk.reset,
	list: util.list,
	table: chalk.reset,
	paragraph: chalk.reset,
	strong: chalk.bold,
	em: chalk.italic,
	codespan: chalk.yellow,
	del: chalk.dim.gray.strikethrough,
	link: chalk.blue,
	href: chalk.blue.underline,
	text: util.identity,
	unescape: true,
	emoji: true,
	width: 80,
	showSectionPrefix: true,
	reflowText: false,
	tab: 4,
	tableOptions: {}
};


export default class Renderer {
	constructor(options = {}, highlightOptions = {}) {
		this.opts = Object.assign({}, defaultOptions, options)
		this.tab = util.sanitizeTab(this.opts.tab)
		this.tableSettings = this.opts.tableOptions
		this.emoji = this.opts.emoji ? util.insertEmojis : util.identity
		this.unescape = this.opts.unescape ? util.unescapeEntities : util.identity
		this.highlightOptions = highlightOptions

		this.transform = compose(util.undoColon, this.unescape, this.emoji)
	}

	textLength(str) {
		return str.replace(/\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, "").length
	}

	text(text) {
		return this.opts.text(text)
	}

	code(code, lang) {
		return util.section(util.indentify(
			util.sanitizeTab(this.opts.tab),
			util.highlight(code, lang, this.opts, this.highlightOptions)
		))
	}

	blockquote(quote) {
		return util.section(this.opts.blockquote(util.indentify(util.sanitizeTab(this.opts.tab), quote.trim())))
	}

	html(html) {
		return this.opts.html(html)
	}

	heading(text, level) {
		text = this.transform(text)

		const prefix = this.opts.showSectionPrefix ? `${new Array(level + 1).join('#')} ` : ''
		text = `${prefix}${text}`
		if (this.opts.reflowText) {
			text = util.reflowText(text, this.opts.width, this.options.gfm)
		}
		return util.section(level === 1 ? this.opts.firstHeading(text) : this.opts.heading(text))
	}

	hr() {
		return util.section(this.opts.hr(util.hr('-', this.opts.reflowText && this.opts.width)))
	}

	list(body, ordered) {
		body = this.opts.list(body, ordered, this.tab)
		return util.section(util.fixNestedLists(util.indentLines(this.tab, body), this.tab))
	}

	listitem(text) {
		const transform = compose(this.opts.listitem, this.transform)
		const isNested = text.indexOf('\n') !== -1
		if (isNested) text = text.trim();

		// Use BULLET_POINT as a marker for ordered or unordered list item
		return `\n${BULLET_POINT}${transform(text)}`
	}

	paragraph(text) {
		const transform = compose(this.opts.paragraph, this.transform)
		text = transform(text)
		if (this.opts.reflowText) {
			text = util.reflowText(text, this.opts.width, this.options.gfm)
		}
		return util.section(text)
	}

	table(header, body) {
		const table = new Table(Object.assign({}, {
			head: util.generateTableRow(header)[0]
		}, this.tableSettings))

		util.generateTableRow(body, this.transform).forEach(row => {
			table.push(row)
		})
		return util.section(this.opts.table(table.toString()))
	}

	tablerow(content) {
		return TABLE_ROW_WRAP + content + TABLE_ROW_WRAP + '\n'
	}

	tablecell(content, flags) {
		return content + TABLE_CELL_SPLIT
	}

	// span level renderer
	strong(text) {
		return this.opts.strong(text)
	}

	em(text) {
		text = util.fixHardReturn(text, this.opts.reflowText)
		return this.opts.em(text)
	}

	codespan(text) {
		text = util.fixHardReturn(text, this.opts.reflowText)
		return this.opts.codespan(text.replace(/:/g, COLON_REPLACER))
	}

	br() {
		return this.opts.reflowText ? HARD_RETURN : '\n'
	}

	del(text) {
		return this.opts.del(text)
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
		let out = `![${text}`

		if (title) {
			out = `${out} – ${title}`
		}

		return `${out}](${href})\n`
	}
}



function compose () {
	var funcs = arguments;
	return function() {
		var args = arguments;
		for (var i = funcs.length; i-- > 0;) {
			args = [funcs[i].apply(this, args)];
		}
		return args[0];
	};
}

