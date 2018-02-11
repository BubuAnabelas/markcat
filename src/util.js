import emoji from 'node-emoji'
import cardinal from 'cardinal'

import {
	TABLE_CELL_SPLIT,
	TABLE_ROW_WRAP_REGEXP,
	COLON_REPLACER_REGEXP,
	TAB_ALLOWED_CHARACTERS,
	HARD_RETURN,
	HARD_RETURN_RE,
	HARD_RETURN_GFM_RE,
	POINT_REGEX,
	BULLET_POINT
} from './constants'

export const textLength = str => {
	return str.replace(/\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, "").length
}

export const reflowText = (text, width, gfm) => {
	const splitRegex = gfm ? HARD_RETURN_GFM_RE : HARD_RETURN_RE

	const sections = text.split(splitRegex)
	const reflowed = []

	for (let section of sections) {
		const fragments = section.split(/(\u001b\[(?:\d{1,3})(?:;\d{1,3})*m)/g)
		let column = 0
		let currentLine = ''
		let lastWasEscapeChar = false
		for (let fragment of fragments) {
			if (fragment === '') {
				lastWasEscapeChar = false
				continue
			}

			// This is an escape code - leave it whole and
			// move to the next fragment.
			if (!textLength(fragment)) {
				currentLine = `${currentLine}${fragment}`
				lastWasEscapeChar = true
				continue
			}

			const words = fragment.split(/[ \t\n]+/)

			for (let word of words) {
				let addSpace = column != 0
				if (lastWasEscapeChar) addSpace = false;

				// If adding the new word overflows the required width
				if (column + word.length + addSpace > width) {
					if (word.length <= width) {
						// If the new word is smaller than the required width
						// just add it at the beginning of a new line
						reflowed.push(currentLine)
						currentLine = word
						column = word.length
					} else {
						// If the new word is longer than the required width
						// split this word into smaller parts.
						let firstWord = word.substr(0, width - column - addSpace)
						if (addSpace) currentLine = `${currentLine} `;
						currentLine = `${currentLine}${firstWord}`
						reflowed.push(currentLine)

						currentLine = ''
						column = 0

						word = word.substr(firstWord.length)
						const words = word.match(new RegExp(`.{1,${width}}`, 'g'))
						for (let word of words) {
							if (word.length) {
								if (column + word.length < width) {
									currentLine = `${currentLine}${word}`
									column += word.length
								} else {
									currentLine = ''
									column = 0
									reflowed.push(word)
								}
							}
						}
					}
				} else {
					if (addSpace) {
						currentLine = `${currentLine} `
						column++
					}

					currentLine = `${currentLine}${word}`
					column += word.length
				}

				lastWasEscapeChar = false
			}
		}

		if (textLength(currentLine)) reflowed.push(currentLine)
	}

	return reflowed.join('\n')
}

export const fixHardReturn = (text, reflow) => reflow ? text.replace(HARD_RETURN, /\n/g) : text

export const unescapeEntities = html => html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")

export const identity = str => str

export const indentLines = (indent, text) => text.replace(/(^|\n)(.+)/g, `$1${indent}$2`)

export const indentify = (indent, text) => {
	if (!text) return
	return `${indent}${text.split('\n').join(`\n${indent}`)}`
}

export const section = text => `${text}\n\n`

// Prevents nested lists from joining their parent list's last line
export const fixNestedLists = (body, indent) => {
	const regex = new RegExp(`(\\S(?: |  )?)((?:${indent})+)(${POINT_REGEX}(?:.*)+)$`, 'm')
	return body.replace(regex, '$1\n' + indent + '$2$3');
}

export const isPointedLine = (line, indent) => line.match(`^(?:${indent})*` + POINT_REGEX);

export const toSpaces = (str) => (' ').repeat(str.length);

export const list = (body, ordered, indent) => {
	body = body.trim()
	return ordered ? numberedLines(body, indent) : bulletPointLines(body, indent);
}

export const bulletPointLine = (indent, line) => {
	return isPointedLine(line, indent) ? line : toSpaces(BULLET_POINT) + line;
}

export const bulletPointLines = (lines, indent) => {
	const transform = bulletPointLine.bind(null, indent)
	return lines.split('\n').filter(identity).map(transform).join('\n')
}

export const numberedPoint = n => `${n}. `

export const numberedLine = (indent, line, num) => isPointedLine(line, indent) ? { num: num+1, line: line.replace(BULLET_POINT, numberedPoint(num+1)) } : { num: num, line: toSpaces(numberedPoint(num)) + line };

export const numberedLines = (lines, indent) => {
	const transform = numberedLine.bind(null, indent)
	let num = 0
	return lines.split('\n').filter(identity).map(line => {
		const numbered = transform(line, num)
		num = numbered.num;

		return numbered.line
	}).join('\n')
}

export const highlight = (code, lang, options, cardinalOptions) => {
	const style = options.code

	code = fixHardReturn(code, options.reflowText)

	if (lang !== 'javascript' && lang != 'js') {
		return style(code)
	}

	try {
		return cardinal.highlight(code, cardinalOptions)
	} catch (e) {
		return style(code)
	}
}

export const insertEmojis = text => text.replace(/:([A-Za-z0-9_\-+]+?):/g, emojiString => {
	const emojiSign = emoji.get(emojiString)
	if (!emojiSign) return emojiString;
	return `${emojiSign} `
})


export const hr = (inputHrStr, length = process.stdout.columns) => {
	return (new Array(length)).join(inputHrStr);
}

export const undoColon = str => str.replace(COLON_REPLACER_REGEXP, ':')

export const generateTableRow = (text, escape = identity) => {
	if (!text) return [];

	const lines = escape(text).split('\n')

	const data = []

	lines.forEach(line => {
		if (!line) return;
		const parsed = line.replace(TABLE_ROW_WRAP_REGEXP, '').split(TABLE_CELL_SPLIT)

		data.push(parsed.splice(0, parsed.length - 1))
	})

	return data
}

export const isAllowedTabString = string => TAB_ALLOWED_CHARACTERS.some(char => string.match(`^(${char})+$`))

export const sanitizeTab = (tab = 4) => {
	if (typeof tab === 'string') {
		if (isAllowedTabString(tab)) {
			return tab;
		}

		tab = 4
	}

	return (new Array(tab + 1)).join(' ');
}
