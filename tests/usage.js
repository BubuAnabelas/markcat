import { identity } from '../src/util'
import Renderer from '../src/'
import marked from 'marked'

const toMarkdown = (text, renderer) => marked(text, { renderer: renderer })

const options = [
	'code', 'blockquote', 'html', 'heading',
	'firstHeading', 'hr', 'listitem', 'table',
	'paragraph', 'strong', 'em', 'codespan',
	'del', 'link', 'href'
];

const defaultOptions = {};
for (let option of options) {
	defaultOptions[option] = identity
}

describe('Renderer', () => {
	const renderer = new Renderer(defaultOptions)

	test('should render links', () => {
		const text = '[markcat](http://npm.im/markcat)'

		expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining('markcat (http://npm.im/markcat)'))
	})

	test('should pass on options to table', () => {
		const options = Object.assign({}, defaultOptions, {
			tableOptions: {
				chars: { 'top': '@@@@TABLE@@@@@' }
			}
		})
		const renderer = new Renderer(options)

		const text = `| Lorem | Ipsum | Sit amet     | Dolar  |
|------|------|----------|----------|
| Row 1  | Value    | Value  | Value |
| Row 2  | Value    | Value  | Value |
| Row 3  | Value    | Value  | Value |
| Row 4  | Value    | Value  | Value |`

		expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining('@@@@TABLE@@@@@'))
	})

	test('should not show link href twice if link and url is equal', () => {
		const text = 'http://npm.im/markcat'

		expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining(text))
	})

	test('should render html as html', () => {
		const text = '<i>markcat</i>'

		expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining(text))
	})

	test('should not translate emojis inside codespans', () => {
		const text = 'Hello `:smile:`'

		expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining('Hello :smile:'))
	})

	describe('text reflowing', () => {
		const options = Object.assign({}, defaultOptions, { reflowText: true, width: 10 })
		const renderer = new Renderer(options)

		test('should reflow paragraph and split words that are too long (one break)', () => {
			const text = 'Now is the time: 01234567890\n'

			expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining('Now is the\ntime: 0123\n4567890\n\n'))
		})

		test('should reflow paragraph and split words that are too long (two breaks)', () => {
			const text = 'Now is the time: http://timeanddate.com\n'

			expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining('Now is the\ntime: http\n://timeand\ndate.com\n\n'))
		})

	})

	describe('lists', () => {
		describe('should render ordered and unordered list with same newlines', () => {
			test('unordered list', () => {
				const text = '* ul item\n* ul item'

				expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining('    * ul item\n    * ul item\n\n'))
			})

			test('ordered list', () => {
				const text = '1. ol item\n2. ol item'

				expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining('    1. ol item\n    2. ol item\n\n'))
			})
		})

		describe('should render nested lists', () => {
			test('unordered list inside unordered list', () => {
				const text = '* ul item\n    * ul item'

				expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining('    * ul item\n        * ul item'))
			})

			test('ordered list inside unordered list', () => {
				const text = '* ul item\n    1. ol item'

				expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining('    * ul item\n        1. ol item'))
			})

			test('unordered list inside ordered list', () => {
				const text = '1. ol item\n    * ul item'

				expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining('    1. ol item\n        * ul item'))
			})

			test('ordered list inside ordered list', () => {
				const text = '1. ol item\n    1. ol item'

				expect(toMarkdown(text, renderer)).toEqual(expect.stringContaining('    1. ol item\n        1. ol item'))
			})
		})
	})
})
