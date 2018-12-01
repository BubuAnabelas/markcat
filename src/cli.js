#!/usr/bin/env node

import yargs from 'yargs'
import marked from 'marked'
import {
	existsSync,
	readFileSync
} from 'fs'
import TerminalRenderer from './index'
import { version } from '../package.json'

const cli = yargs()
	.command('*', 'markcat')
	.version(version)
	.locale('en')
	.help()
	.usage('$0 [filename]', 'View Markdown files in the terminal')
	.option('no-gfm', {
		describe: `Disable GitHub Flavored Markdown`,
		type: 'boolean'
	})
	.option('no-tables', {
		describe: `Disable GFM tables. This option requires the gfm option to be true`,
		type: 'boolean'
	})
	.option('no-breaks', {
		describe: `Disable GFM line breaks. This option requires the gfm option to be true`,
		type: 'boolean'
	})
	.option('p', {
		alias: 'pedantic',
		describe: `Conform to original's markdown.pl as much as possible. Don't fix any of the original markdown bugs or poor behavior`,
		type: 'boolean'
	})
	.option('s', {
		alias: 'sanitize',
		describe: `Sanitize the output. Ignore any HTML that has been input`,
		type: 'boolean'
	})
	.option('S', {
		alias: 'no-smartlists',
		describe: `Use smarter list behavior than the original markdown`,
		type: 'boolean'
	})
	.option('smartypants', {
		describe: `Use "smart" typographic punctuation for things like quotes and dashes`,
		type: 'boolean'
	})
	.parse(process.argv.slice(2))

const opts = ({ gfm = true, tables = true, breaks = false, pedantic = false, sanitize = false, smartLists = true, smartypants = false }) => {
	return { gfm, tables, breaks, pedantic, sanitize, smartLists, smartypants }
}

const defaultOptions = opts({
	gfm: cli.gfm,
	tables: cli.tables,
	breaks: cli.breaks,
	pedantic: cli.pedantic,
	sanitize: cli.sanitize,
	smartLists: cli.smartlists,
	smartypants: cli.smartypants
})

marked.setOptions({ ...defaultOptions, renderer: new TerminalRenderer() });

if (!cli.filename || !existsSync(cli.filename)) {
	process.stderr.write(`File doesn't exist\n`)
	process.exit(1)
}

const file = readFileSync(cli.filename).toString()

process.stdout.write(marked(file))
