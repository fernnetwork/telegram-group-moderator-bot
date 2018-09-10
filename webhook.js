'use strict'

// bug workaround: https://github.com/yagop/node-telegram-bot-api/issues/484
process.env.NTBA_FIX_319 = 1

const TelegramBot = require('node-telegram-bot-api')
const { checkContents } = require('./contentChecker')

const { TELEGRAM_BOT_TOKEN, WHITELIST_USERS = '', DISABLED_CHECKS = '' } = process.env

const whitelistedUserIds = WHITELIST_USERS.split(',')
const disabledChecks = DISABLED_CHECKS.split(',')

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN)

const handler = async (event) => {
  if (decodeURIComponent(event.pathParameters.token) !== TELEGRAM_BOT_TOKEN) {
    return {
      statusCode: 403
    }
  }

  const body = JSON.parse(event.body)
  const message = body.message || body.edited_message

  if (message && !whitelistedUserIds.includes(message.from.username)) {
    const { from, chat } = message

    try {
      const opts = { disabledChecks }
      const errorMsg = checkContents(message, opts)

      if (errorMsg) {
        const fullname = `${from.first_name} ${from.last_name}`
        console.log(`Deleted message from user:\n  Username: ${from.username}\n  Full name: ${fullname}\n  Reason: ${errorMsg}\n  Message: ${message.text || ''}`)
        await bot.deleteMessage(chat.id, message.message_id)
      }
    } catch (error) {
      console.error(`Error processing message: ${JSON.stringify(message)}\n`, error.stack)
    }
  }

  return {
    statusCode: 200
  }
}

module.exports = { handler }
