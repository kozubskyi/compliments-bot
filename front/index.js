//* npm - node-telegram-bot-api

require("dotenv").config() // Без этого кода перед require("node-telegram-bot-api") и NTBA_FIX_319 = 1 в файле .env выдает ошибку:
// node-telegram-bot-api deprecated Automatic enabling of cancellation of promises is deprecated. In the future, you will have to enable it yourself. See https://github.com/yagop/node-telegram-bot-api/issues/319. at node:internal/modules/cjs/loader:1105:14
// Решение: https://github.com/yagop/node-telegram-bot-api/issues/540

const TelegramBot = require("node-telegram-bot-api")
// const dotenv = require("dotenv")
const axios = require("axios")

// dotenv.config()
const { BOT_TOKEN, KOZUBSKYI_CHAT_ID, LENA_RAK_CHAT_ID, DB_BASE_URL } = process.env

const bot = new TelegramBot(BOT_TOKEN, { polling: true })

function start() {
  const SWEET_CHAT_ID = Number(LENA_RAK_CHAT_ID)
  const CREATOR_CHAT_ID = Number(KOZUBSKYI_CHAT_ID)

  bot.setMyCommands([
    // { command: "/start", description: "Почати" },
    { command: "/compliment", description: "Отримати компліментик" },
  ])

  // 👇 обработчик получения сообщения от пользователя
  bot.on("message", async (msg) => {
    console.log({ msg })
    // msg = {
    //   from: {
    //     first_name: "Name",
    //     last_name: "Surname",
    //     username: "nickname",
    //   },
    //   chat: {
    //     id: 123456789,
    //   },
    //   text: "message from user",
    // }

    await makeResponse({
      firstName: msg.from.first_name,
      lastName: msg.from.last_name,
      username: msg.from.username,
      chatId: msg.chat.id,
      command: msg.text,
    })
  })

  // 👇 Обработчик клика на кнопку (если она есть)
  // bot.on("callback_query", async (cb) => {
  //   await makeResponse({
  //     firstName: cb.from.first_name,
  //     lastName: cb.from.last_name,
  //     username: cb.from.username,
  //     chatId: cb.message.chat.id,
  //     command: cb.data,
  //   })
  // })

  async function makeResponse(user) {
    const { firstName, lastName, username, chatId, command } = user
    let response = null
    let buttonOptions = {}

    try {
      //todo - create user if he isn't in DB

      //todo - increase user.messages +1 if the user was in DB

      // await handleUser(user)

      if (chatId === SWEET_CHAT_ID) {
        if (command === "/start") {
          response =
            "Лєнусік, привіт) 😘 Денис просив передати тобі багато компліментиків. Напиши або натисни /compliment і отримаєшь компліментик)"
        } else if (command === "/compliment") {
          const { data } = await axios.get(`${DB_BASE_URL}/compliments`)
          const randomIndex = Math.floor(Math.random() * data.length)

          response = data[randomIndex][1]
        } else {
          response = "Я передам Денису те, що ти написала) 😘"
        }
      } else if (chatId === CREATOR_CHAT_ID) {
        const [adminCommand, newData] = separateCommand(command)

        if (adminCommand === "add") {
          await axios.post(`${DB_BASE_URL}/compliments`, { text: newData })

          response = "✅ Компліментик додано в базу даних"
        } else if (adminCommand === "del") {
          await axios.delete(`${DB_BASE_URL}/compliments/${newData}`)

          response = "✅ Компліментик видалено з бази даних або такого і не було"
        } else if (adminCommand === "mlr") {
          await bot.sendMessage(SWEET_CHAT_ID, newData)

          response = "✅ Повідомлення Лєнусічке відправлено"
        } else if (adminCommand === "msg") {
          const [receiverChatId, text] = separateCommand(newData)

          await bot.sendMessage(Number(receiverChatId), text)
          response = "✅ Повідомлення користувачу відправлено"
        } else if (command === "/all") {
          const { data } = await axios.get(`${DB_BASE_URL}/compliments`)

          response = JSON.stringify(data)
        } else if (command === "/allq") {
          const { data } = await axios.get(`${DB_BASE_URL}/compliments`)

          response = data.length
        } else if (command === "/help") {
          response = `
        🗣️ Команди:
        "add _" - додати у базу даних новий компліментик з текстом _;
        "del _" - видалити з бази даних компліментик з текстом _;
        "mlr _" - відправити повідомлення Олені Рак з текстом _;
        "msg _ __" - відправити повідомлення користувачу з chatId _ і текстом __;
        "/all" - отримати entries усіх компліментиков;
        "/allq - отримати кількість усіх компліментиков у базі даних.
        `
        } else {
          response = "⚠️ Некоректна команда"
        }
      } else {
        if (command === "/start" || command === "/compliment") {
          response = "Нажаль Ви не Олена Рак, а компліментики я роблю лише їй 🤷‍♂️"
          // buttonOptions = {
          //   reply_markup: JSON.stringify({
          //     inline_keyboard: [[{ text: "Получить комплиментик", callback_data: "/compliment" }]],
          //   }),
          // }
        } else {
          response = "Я передам Денису те, що Ви написали 😉"
        }
      }

      await bot.sendMessage(chatId, response, buttonOptions)

      if (chatId !== CREATOR_CHAT_ID) {
        await bot.sendMessage(
          CREATOR_CHAT_ID,
          `ℹ️ Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${command}" і отримав(-ла) відповідь "${response}"`
        )
      }
    } catch (err) {
      if (chatId !== CREATOR_CHAT_ID) {
        await bot.sendMessage(chatId, "Я трошки зламався, скоро полагоджусь і повернусь 👨‍🔧⚙️😊")
      }

      await bot.sendMessage(
        CREATOR_CHAT_ID,
        `❌ Помилка! Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${command}" і виникла помилка "${err.message}"`
      )
    }
  }

  async function handleUser({ firstName, lastName, username, chatId }) {
    await axios.post(`${DB_BASE_URL}/users`, { firstName, lastName, username, chatId })
  }

  function separateCommand(msg) {
    const msgArr = msg.split(" ")
    const cmd = msgArr[0]
    const text = msgArr.slice(1).join(" ")

    return [cmd, text]
  }
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

