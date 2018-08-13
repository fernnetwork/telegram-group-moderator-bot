'use strict'

const { checkContents } = require('./contentChecker')

it('does not return error if message is permitted', () => {
  expect(checkContents('Hello Andrew!')).toBeUndefined()
})

it('returns an error when message is a photo', () => {
  expect(checkContents({ photo: [] })).toMatch(/photo/i)
})

it('returns an error when message is a video', () => {
  expect(checkContents({ video: {} })).toMatch(/video/i)
})

it('returns an error when message is a document', () => {
  expect(checkContents({ document: {} })).toMatch(/document/i)
})

it('returns an error when message is a sticker', () => {
  expect(checkContents({ sticker: {} })).toMatch(/sticker/i)
})

it('does not return error if a check is disabled', () => {
  expect(checkContents({ sticker: {} }, { disabledChecks: [ 'sticker' ] })).toBeUndefined()
})

describe('when url exists in a message', () => {
  const textMessages = [
    'fern.network',
    'www.fern.network',
    'http://fern.network',
    'https://fern.network',
    'Hey go to fakefern.network',
    'Hey go to http://fakefern.network, I\'ll give you fern'
  ]

  textMessages.forEach(text => {
    it(`${text} returns an error`, () => {
      expect(checkContents({ text })).toMatch(/URL/i)
    })
  })
})

describe('when eth addresses exists in a message', () => {
  const textMessages = [
    'b29E5A8F79cAbFa1E70034f0Eab3fbda92b3185d',
    '0xb29E5A8F79cAbFa1E70034f0Eab3fbda92b3185d',
    'Hey deposit to 0xb29E5A8F79cAbFa1E70034f0Eab3fbda92b3185d',
    'Deposit to b29E5A8F79cAbFa1E70034f0Eab3fbda92b3185d and get your FERNs today!'
  ]

  textMessages.forEach(text => {
    it(`${text} returns an error`, () => {
      expect(checkContents({ text })).toMatch(/Wallet address/i)
    })
  })
})
