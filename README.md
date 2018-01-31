<p align="center">
	<img src="https://i.imgur.com/Kp0FVMr.png" width="250" alt="markcat" />
	<br />
	<a href="https://www.npmjs.org/package/markcat"><img src="https://img.shields.io/npm/v/markcat.svg" alt="NPM Badge"></a>
	<a href="https://travis-ci.org/BubuAnabelas/markcat"><img src="https://img.shields.io/travis/BubuAnabelas/markcat.svg" alt="Travis Badge" /></a>
</p>

# markcat

> Markdown files terminal viewer.

_Based on [marked-terminal](https://github.com/mikaelbr/marked-terminal)_

- **Code highlight** right out of the box.
- Based on the popular [**marked**](https://github.com/chjj/marked) package.
- **Github Flavored Markdown** support.
- Renders your emojis :tada:.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Example](#example)
- [License](#license)

## Install

Make sure you have Node.js version 8 or higher installed

```sh
$ npm install -g markcat
```

## Usage

```
$ markcat [filename]

View Markdown files in the terminal

Options:
  --version            Show version number
  --help               Show help
  --no-gfm             Disable GitHub Flavored Markdown
  --no-tables          Disable GFM tables. This option requires the gfm option
                       to be true
  --no-breaks          Disable GFM line breaks. This option requires the gfm
                       option to be true
  -p, --pedantic       Conform to original's markdown.pl as much as possible.
                       Don't fix any of the original markdown bugs or poor
                       behavior
  -s, --sanitize       Sanitize the output. Ignore any HTML that has been input

  -S, --no-smartlists  Use smarter list behavior than the original markdown

  --smartypants        Use "smart" typographic punctuation for things like
                       quotes and dashes
```

## Example

[![asciicast](https://asciinema.org/a/xR59kF01pnzoKLpJ3OVbfyMlM.png)](https://asciinema.org/a/xR59kF01pnzoKLpJ3OVbfyMlM)

## License

[MIT License](https://oss.ninja/mit/bubuanabelas) © Joaquín Serna
