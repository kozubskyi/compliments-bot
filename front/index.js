require('dotenv').config() // Без этого кода перед require("node-telegram-bot-api") и NTBA_FIX_319 = 1 в файле .env выдает ошибку:
// node-telegram-bot-api deprecated Automatic enabling of cancellation of promises is deprecated. In the future, you will have to enable it yourself. See https://github.com/yagop/node-telegram-bot-api/issues/319. at node:internal/modules/cjs/loader:1105:14
// Решение: https://github.com/yagop/node-telegram-bot-api/issues/540

const TelegramBot = require('node-telegram-bot-api')
const makeResponse = require('./make-response')

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

function start() {
  bot.setMyCommands([
    { command: '/start', description: '👋 Привітання' },
    { command: '/compliment', description: '💝 Компліментик' },
    { command: '/wish', description: '✨ Побажаннячко' },
    { command: '/help', description: '❔ Допомога' },
  ])

  // Обробник отримання повідомлення
  bot.on('message', async (msg) => {
    await makeResponse(bot, {
      firstName: msg.from.first_name,
      lastName: msg.from.last_name,
      username: msg.from.username,
      chatId: msg.chat.id,
      command: msg.text,
    })
  })

  // Обробник кліка на кнопку
  bot.on('callback_query', async (cbq) => {
    await makeResponse(bot, {
      firstName: cbq.from.first_name,
      lastName: cbq.from.last_name,
      username: cbq.from.username,
      chatId: cbq.message.chat.id,
      command: cbq.data,
    })
  })

  // Обробник конкретного отриманого повідомлення, яке починається з "/creatortest"
  // bot.onText(/\/creatortest/, (msg, match) => {
  //   console.log({ msg, match })
  //   console.log('msg.entities', msg.entities)

  //   bot.sendMessage(msg.chat.id, 'робе')
  // })
}

start()
