import kleur from 'kleur'
import { list, identity } from './util'

const defaultOptions = {
	code: kleur.yellow,
	blockquote: kleur.gray().bgWhite().italic,
	html: kleur.gray,
	heading: kleur.green().bold,
	firstHeading: kleur.magenta().underline().bold,
	hr: kleur.reset,
	listitem: kleur.reset,
	list: list,
	table: kleur.reset,
	paragraph: identity,
	strong: kleur.bold,
	em: kleur.italic,
	codespan: kleur.yellow,
	del: kleur.dim().gray().strikethrough,
	link: kleur.blue,
	href: kleur.blue().underline,
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
