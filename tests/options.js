import { identity } from '../src/util'
import Renderer from '../src/'
import marked from 'marked'

const options = [
	'code', 'blockquote', 'html', 'heading',
	'firstHeading', 'hr', 'listitem', 'table',
	'paragraph', 'strong', 'em', 'codespan',
	'del', 'link', 'href'
]

const defaultOptions = {}
for (let option of options) {
	defaultOptions[option] = identity
}

const toMarkdown = (text, renderer) => marked(text, { renderer: renderer })

describe('options', () => {
	const renderer = new Renderer(defaultOptions)

	describe('emojis', () => {
		const emojiText = 'Hello :smile:'

		test('should not translate emojis', () => {
			const options = Object.assign({}, defaultOptions, { emoji: false })
			const renderer = new Renderer(options)

			expect(toMarkdown(emojiText, renderer)).toEqual(expect.stringContaining('Hello :smile:'))
		})

		test('should translate emojis', () => {
			const options = Object.assign({}, defaultOptions, { emoji: true })
			const renderer = new Renderer(options)

			expect(toMarkdown(emojiText, renderer)).toEqual(expect.stringContaining('Hello 😄'))
		})
	})

	describe('tabs', () => {
		const blockquoteText = '> Blockquote'
		const listText = '* List Item'

		describe('should change tabs by space size', () => {
			const options = Object.assign({}, defaultOptions, { tab: 4 })
			const renderer = new Renderer(options)

			test('blockquote tabs', () => {
				expect(toMarkdown(blockquoteText, renderer)).toEqual(expect.stringContaining('    Blockquote\n\n'))
			})

			test('list tabs', () => {
				expect(toMarkdown(listText, renderer)).toEqual(expect.stringContaining('    * List Item\n\n'))
			})

			test('numered list', () => {
				expect(toMarkdown('1. Number one', renderer)).toEqual(expect.stringContaining('    1. Number one\n\n'))
			})
		})

		describe('should use default tabs if passing not supported string', () => {
			const options = Object.assign({}, defaultOptions, { tab: 'aaaa' })
			const renderer = new Renderer(options)

			test('blockquote tabs', () => {
				expect(toMarkdown(blockquoteText, renderer)).toEqual(expect.stringContaining('    Blockquote\n\n'))
			})

			test('list tabs', () => {
				expect(toMarkdown(listText, renderer)).toEqual(expect.stringContaining('    * List Item\n\n'))
			})
		})

		describe('should change tabs by allowed characters', () => {
			const options = Object.assign({}, defaultOptions, { tab: '\t' })
			const renderer = new Renderer(options)

			test('blockquote tabs', () => {
				expect(toMarkdown(blockquoteText, renderer)).toEqual(expect.stringContaining('\tBlockquote\n\n'))
			})

			test('list tabs', () => {
				expect(toMarkdown(listText, renderer)).toEqual(expect.stringContaining('\t* List Item\n\n'))
			})
		})

		describe('should support mulitple tab characters', () => {
			const options = Object.assign({}, defaultOptions, { tab: '\t\t' })
			const renderer = new Renderer(options)

			test('blockquote tabs', () => {
				expect(toMarkdown(blockquoteText, renderer)).toEqual(expect.stringContaining('\t\tBlockquote\n\n'))
			})

			test('list tabs', () => {
				expect(toMarkdown(listText, renderer)).toEqual(expect.stringContaining('\t\t* List Item\n\n'))
			})
		})
	})

	describe('escaping characters', () => {
		const escapeText = '"Hello"'

		test('should not escape some characters', () => {
			const options = Object.assign({}, defaultOptions, { unescape: true })
			const renderer = new Renderer(options)

			expect(toMarkdown(escapeText, renderer)).toEqual(expect.stringContaining(escapeText))
		})

		test('should escape some characters', () => {
			const options = Object.assign({}, defaultOptions, { unescape: false })
			const renderer = new Renderer(options)

			expect(toMarkdown(escapeText, renderer)).toEqual(expect.stringContaining('&quot;Hello&quot;'))
		})

	})
})
