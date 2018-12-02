#!/usr/bin/env node

import commander from 'commander'
import marked from 'marked'
import {
	existsSync,
	readFileSync
} from 'fs'
import TerminalRenderer from './index'
import { version } from '../package.json'

const opts = ({ gfm = true, tables = true, breaks = false, pedantic = false, sanitize = false, smartLists = true, smartypants = false }) => ({ gfm, tables, breaks, pedantic, sanitize, smartLists, smartypants })

const markcat = commander
	.arguments('[filename]')
	.description('View Markdown files in the terminal')
	.version(version, '--version')
	.option('--no-gfm', `Disable GitHub Flavored Markdown`)
	.option('--no-tables', `Disable GFM tables. This option requires the gfm option to be true`)
	.option('--no-breaks', `Disable GFM line breaks. This option requires the gfm option to be true`)
	.option('-p, --pedantic', `Conform to original's markdown.pl as much as possible. Don't fix any of the original markdown bugs or poor behavior`)
	.option('-s, --commander', `Sanitize the output. Ignore any HTML that has been input`)
	.option('-S, --no-smartlists', `Use smarter list behavior than the original markdown`)
	.option('--smartypants', `Use "smart" typographic punctuation for things like quotes and dashes`)
	.action((filename, options) => {
		const defaultOptions = opts({
			gfm: options.gfm,
			tables: options.tables,
			breaks: options.breaks,
			pedantic: options.pedantic,
			sanitize: options.sanitize,
			smartLists: options.smartlists,
			smartypants: options.smartypants
		})

		marked.setOptions({ ...defaultOptions, renderer: new TerminalRenderer() });

		if (!filename || !existsSync(filename)) {
			process.stderr.write(`File doesn't exist\n`)
			process.exit(1)
		}

		const file = readFileSync(filename).toString()

		process.stdout.write(marked(file))
	})
	.parse(process.argv)
