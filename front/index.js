//* npm - node-telegram-bot-api

require('dotenv').config() // Без этого кода перед require("node-telegram-bot-api") и NTBA_FIX_319 = 1 в файле .env выдает ошибку:
// node-telegram-bot-api deprecated Automatic enabling of cancellation of promises is deprecated. In the future, you will have to enable it yourself. See https://github.com/yagop/node-telegram-bot-api/issues/319. at node:internal/modules/cjs/loader:1105:14
// Решение: https://github.com/yagop/node-telegram-bot-api/issues/540

const TelegramBot = require('node-telegram-bot-api')
const makeResponse = require('./make-response')

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

function start() {
  bot.setMyCommands([
    // { command: "/start", description: "Почати" },
    { command: '/compliment', description: 'Отримати комплімент' },
    { command: '/wish', description: 'Отримати побажання' },
  ])

  bot.on('message', async (msg) => {
    // console.log({ msg })
    await makeResponse(bot, {
      firstName: msg.from.first_name,
      lastName: msg.from.last_name,
      username: msg.from.username,
      chatId: msg.chat.id,
      command: msg.text,
    })
    // msg = {
    //   message_id: 1,
    //   from: {
    //     id: 123456789, // equal to chat.id
    //     is_bot: false,
    //     first_name: "Name",
    //     last_name: "Surname",
    //     username: "nickname",
    //     language_code: "ru",
    //   },
    //   chat: {
    //     id: 123456789, // equal to from.id
    //     first_name: "Name",
    //     last_name: "Surname",
    //     username: "nickname",
    //     type: "private", // channel, group, private, supergroup
    //   },
    //   date: 1234567890, // don't know the format
    //   text: "user typed message",
    //   entities: [[Object]],
    // }
  })

  // Обробник кліка на кнопку (якщо вона є)
  // bot.on("callback_query", async (cbq) => {
  //   await makeResponse(bot, {
  //     firstName: cbq.from.first_name,
  //     lastName: cbq.from.last_name,
  //     username: cbq.from.username,
  //     chatId: cbq.message.chat.id,
  //     command: cbq.data,
  //   })
  // })

  // Обробник отриманого повідомлення, яке починається з "/creatortest"
  // bot.onText(/\/creatortest/, (msg, match) => {
  //   console.log({ msg, match })
  //   console.log('msg.entities', msg.entities)

  //   bot.sendMessage(msg.chat.id, 'робе')
  // })
}
start()

/*

//* npm - telegraf

const { Telegraf } = require("telegraf")
const dotenv = require("dotenv")
const axios = require("axios")

dotenv.config()
const { BOT_TOKEN, KOZUBSKYI_CHAT_ID, LENA_RAK_CHAT_ID, DATADB_BASE_URL } = process.env

const bot = new Telegraf(BOT_TOKEN)

function start() {
  const sweet = "lena_rak_05"
  const creator = "kozubskyi"
  const sweetChatId = Number(LENA_RAK_CHAT_ID)
  const creatorChatId = Number(KOZUBSKYI_CHAT_ID)

  bot.on("text", async (ctx) => {
    const firstName = ctx.message.from.first_name
    const lastName = ctx.message.from.last_name
    const username = ctx.message.from.username
    const command = ctx.message.text
    const chatId = ctx.message.chat.id

    let response

    try {
      if (username === sweet) {
        if (command === "/start") {
          response =
            "Ленусик, приветик) 😘 Денис просил передать тебе кучу комплиментиков. Напиши или нажми /compliment и получишь комплиментик)"
        } else if (command === "/compliment") {
          const { data } = await axios.get(DATADB_BASE_URL)
          const randomIndex = Math.floor(Math.random() * data.length)

          response = data[randomIndex].text
        } else {
          response = "Я передам Денису то, что ты написала) 😘"
        }
      } else if (username === creator) {
        const [adminCommand, newData] = separateCommand(command)

        if (adminCommand === "add") {
          await axios.post(DATADB_BASE_URL, { text: newData })

          response = "Комплиментик успешно добавлен"
        } else if (adminCommand === "del") {
          await axios.delete(`${DATADB_BASE_URL}/${newData}`)

          response = "Комплиментик успешно удален"
        } else if (adminCommand === "mlr") {
          ctx.telegram.sendMessage(sweetChatId, newData)

          response = "Сообщение любимой успешно отправлено"
        } else if (adminCommand === "msg") {
          const [receiverChatId, text] = separateCommand(newData)

          ctx.telegram.sendMessage(Number(receiverChatId), text)
          response = "Сообщение пользователю успешно отправлено"
        } else if (command === "/all") {
          const { data } = await axios.get(DATADB_BASE_URL)

          response = JSON.stringify(data)
        } else if (command === "/help") {
          response = `
        "add _" - добавить новый комплиментик с текстом _
        "del _" - удалить комплиментик с текстом _
        "mlr _" - отправить сообщение Лене Рак с текстом _
        "msg _ __" - отправить сообщение пользователю с id чата _ и текстом __
        "/all" - получить массив всех комплиментиков
        `
        } else {
          response = "Некорректная команда"
        }
      } else {
        if (command === "/start" || command === "/compliment") {
          response = "К сожалению Вы не Елена Рак, а комплиментики я делаю только ей 🤷‍♂️"
        } else {
          response = "Я передам Денису то, что Вы написали 😉"
        }
      }

      ctx.reply(response)

      username !== creator &&
        ctx.telegram.sendMessage(
          creatorChatId,
          `Пользователь "${firstName} ${lastName} <${username}> (${chatId})" отправил(-а) сообщение "${command}" и получил(-а) ответ "${response}"`
        )
    } catch (err) {
      username !== creator && ctx.reply("Я немножко сломался, скоро починюсь и вернусь 👨‍🔧⚙️😊")

      ctx.telegram.sendMessage(
        creatorChatId,
        `❌ Ошибка! Пользователь "${firstName} ${lastName} <${username}> (${chatId})" отправил(-а) сообщение "${command}" и получилась ошибка "${err.message}"`
      )
    }
  })
}

start()

bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))

function separateCommand(msg) {
  const msgArr = msg.split(" ")
  let data = msgArr[0]
  let text = msgArr.slice(1).join(" ")

  return [data, text]
}

*/
