const { Telegraf, Markup } = require('telegraf')
const dotenv = require('dotenv')
const makeResponse = require('./make-response')
const handleUser = require('./helpers/handle-user')
const commandsHtml = require('./helpers/commands')

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)

function start() {
  // bot.start((ctx) => ctx.reply('Welcome'))
  // bot.help((ctx) => ctx.reply('Send me a sticker'))
  // bot.on('sticker', (ctx) => ctx.reply('👍'))
  // bot.hears('hi', (ctx) => ctx.reply('Hey there'))

  // bot.command('oldschool', (ctx) => ctx.reply('Hello'))
  // bot.command('hipster', Telegraf.reply('λ'))

  // bot.on('text', (ctx) => ctx.reply(ctx.message.text))

  // bot.action('btn_action', (ctx) => {})

  // bot.on('text', async (ctx) => {
  //   console.log(ctx)

  //   // await makeResponse(bot, {
  //   //   firstName: ctx.message.from.first_name,
  //   //   lastName: ctx.message.from.last_name,
  //   //   username: ctx.message.from.username,
  //   //   chatId: ctx.message.chat.id,
  //   //   command: ctx.message.text,
  //   //   ctx,
  //   // })
  // })

  // bot.help(async (ctx) => {
  //   const firstName = ctx.message.from.first_name
  //   const lastName = ctx.message.from.last_name
  //   const username = ctx.message.from.username
  //   const command = ctx.message.text
  //   const chatId = ctx.message.chat.id

  //   const user = await handleUser(bot)
  // })

  // bot.command('help', (ctx) => {
  //   ctx.replyWithHTML('HELP')
  // })

  bot.start((ctx) => {
    console.log('Received /start command')
    try {
      return ctx.reply('Hi')
    } catch (e) {
      console.error('error in start action:', e)
      return ctx.reply('Error occured')
    }
  })

  console.log('✅ The bot is configured and working correctly')
}

start()

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async (event) => {
  try {
    await bot.handleUpdate(JSON.parse(event.body))
    return { statusCode: 200, body: '' }
  } catch (e) {
    console.error('error in handler:', e)
    return { statusCode: 400, body: 'This endpoint is meant for bot and telegram communication' }
  }
}
