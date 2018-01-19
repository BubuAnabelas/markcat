
const escapeRegExp = str => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

export const TABLE_CELL_SPLIT = '^*||*^'
export const TABLE_ROW_WRAP = '*|*|*|*'
export const TABLE_ROW_WRAP_REGEXP = new RegExp(escapeRegExp(TABLE_ROW_WRAP), 'g')

export const COLON_REPLACER = '*#COLON|*'
export const COLON_REPLACER_REGEXP = new RegExp(escapeRegExp(COLON_REPLACER), 'g')

export const TAB_ALLOWED_CHARACTERS = ['\t']

// HARD_RETURN holds a character sequence used to indicate text has a
// hard (no-reflowing) line break.  Previously \r and \r\n were turned
// into \n in marked's lexer- preprocessing step. So \r is safe to use
// to indicate a hard (non-reflowed) return.
export const HARD_RETURN = '\r'
export const HARD_RETURN_RE = new RegExp(HARD_RETURN)
export const HARD_RETURN_GFM_RE = new RegExp(`${HARD_RETURN}|<br />`)


export const BULLET_POINT_REGEX = '\\*'
export const NUMBERED_POINT_REGEX = '\\d+\\.'
export const POINT_REGEX = `(?:${[BULLET_POINT_REGEX, NUMBERED_POINT_REGEX].join('|')})`


export const BULLET_POINT = '* '