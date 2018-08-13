'use strict'

const urlRegex = require('url-regex')
const ethRegex = /\b(?:0x)?[a-f0-9]{40}\b/i

const checks = {
  url: {
    isDisallowed: (content) => content.text && urlRegex({ strict: false }).test(content.text),
    errorMsg: 'URL is not allowed in messages'
  },
  ethAddress: {
    isDisallowed: (content) => content.text && ethRegex.test(content.text),
    errorMsg: 'Wallet address is not allowed in messages'
  },
  photo: {
    isDisallowed: (content) => !!content.photo,
    errorMsg: 'Photos are not allowed in messages'
  },
  video: {
    isDisallowed: (content) => !!content.video,
    errorMsg: 'Videos are not allowed in messages'
  },
  document: {
    isDisallowed: (content) => !!content.document,
    errorMsg: 'Documents are not allowed in messages'
  },
  sticker: {
    isDisallowed: (content) => !!content.sticker,
    errorMsg: 'Stickers are not allowed in messages'
  }
}

module.exports = {
  checkContents: (content, opts = { disabledChecks: [] }) => {
    const { disabledChecks } = opts

    for (const [ name, check ] of Object.entries(checks)) {
      const { isDisallowed, errorMsg } = check
      if (!disabledChecks.includes(name) && isDisallowed(content)) {
        return errorMsg
      }
    }
  }
}
