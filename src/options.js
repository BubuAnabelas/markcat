import chalk from 'chalk'
import { list, identity } from './util'

const defaultOptions = {
	code: chalk.yellow,
	blockquote: chalk.gray.bgWhiteBright.italic,
	html: chalk.gray,
	heading: chalk.green.bold,
	firstHeading: chalk.magenta.underline.bold,
	hr: chalk.reset,
	listitem: chalk.reset,
	list: list,
	table: chalk.reset,
	paragraph: identity,
	strong: chalk.bold,
	em: chalk.italic,
	codespan: chalk.yellow,
	del: chalk.dim.gray.strikethrough,
	link: chalk.blue,
	href: chalk.blue.underline,
	text: identity,
	unescape: true,
	emoji: true,
	width: 80,
	showSectionPrefix: true,
	reflowText: false,
	tab: 4,
	tableOptions: {}
}

export default defaultOptions
