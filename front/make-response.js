const axios = require('axios')
const { getStartCmdResponse, getComplimentCmdResponse, getElseResponse, separateCommand } = require('./helpers')
const { KOZUBSKYI_CHAT_ID, LENA_RAK_CHAT_ID, DB_BASE_URL } = process.env
const SWEET_CHAT_ID = Number(LENA_RAK_CHAT_ID)
const CREATOR_CHAT_ID = Number(KOZUBSKYI_CHAT_ID)

async function makeResponse(bot, { firstName, lastName, username, chatId, command }) {
  let response = null
  let buttonOptions = {}

  try {
    const user = await handleUser({ firstName, lastName, username, chatId, command })

    // user.status = 'creator'; //* ⬅️ for testing (creator, sweet, family, friend, others)

    if (command === '/start') response = getStartCmdResponse(user.status)
    else if (command === '/compliment') response = await getComplimentCmdResponse(user.status)
    else response = getElseResponse(user.status)

    if (user.status === 'creator') {
      const [adminCommand, data] = separateCommand(command)

      if (adminCommand === 'add') {
        const [status, text] = separateCommand(data)
        const resp = await axios.post(`${DB_BASE_URL}/compliments`, { text, for: status })

        response = `✅ Компліментик додано в базу даних: ${JSON.stringify(resp.data)}`
      }
      if (adminCommand === 'addcompliments') {
        await axios.post(`${DB_BASE_URL}/compliments/all`, JSON.parse(data))

        response = '✅ Всі компліментики додано в базу даних'
      }
      if (adminCommand === 'del') {
        const resp = await axios.delete(`${DB_BASE_URL}/compliments/text/${data}`)
        // Цікаве: при методі DELETE не передається body, інфу можна передавати лише черер params

        if (resp.data) {
          response = `✅ Компліментик видалено з бази даних: ${JSON.stringify(resp.data)}`
        } else {
          response = 'ℹ️ Такого компліментика і не було в базі даних'
        }
      }
      if (command === 'delcompliments') {
        await axios.delete(`${DB_BASE_URL}/compliments/`)

        response = '✅ Всі компліментики видалено з бази даних'
      }
      if (adminCommand === 'mlr') {
        await bot.sendMessage(SWEET_CHAT_ID, data)
        response = '✅ Повідомлення відправлено'
      }
      if (adminCommand === 'msg') {
        const [receiverChatId, text] = separateCommand(data)

        await bot.sendMessage(Number(receiverChatId), text)
        response = '✅ Повідомлення відправлено'
      }
      if (command === '/compliments') {
        const resp = await axios.get(`${DB_BASE_URL}/compliments`)

        response = JSON.stringify(resp.data.map((compliment) => ({ text: compliment.text, for: compliment.for })))
      }
      if (command === '/complimentsq') {
        const resp = await axios.get(`${DB_BASE_URL}/compliments`)

        response = resp.data.length
      }
      if (command === '/users') {
        const resp = await axios.get(`${DB_BASE_URL}/users`)

        response = JSON.stringify(resp.data)
      }
      if (command === '/usersq') {
        const resp = await axios.get(`${DB_BASE_URL}/users`)

        response = resp.data.length
      }
      if (command === '/test') {
        response = '✅'
      }
      if (command === '/help') {
        response = `
        🗣️ Команди:
        "add _ __" - додати у базу даних новий компліментик для статусу _ з текстом __;
        "addcompliments _" - додати в базу даних усі компліментики масиву _;
        "del _" - видалити з бази даних компліментик з текстом _;
        "delcompliments" - видалити всі компліментики з бази даних;
        "mlr _" - відправити повідомлення Олені Рак з текстом _;
        "msg _ __" - відправити повідомлення користувачу з chatId _ і текстом __;
        "/compliments" - отримати масив тільки з полями text та for усіх компліментиків;
        "/complimentsq" - отримати кількість усіх компліментиков у базі даних;
        "/users" - отримати масив з повною інформацією всіх користувачів;
        "/usersq" - отримати кількість усіх користувачів у базі даних;
        "/test" - тестова команда;
        "/help" - отримати список усіх можливих команд.
        `
      }
    }

    // buttonOptions = {
    //   reply_markup: JSON.stringify({
    //     inline_keyboard: [[{ text: "Получить комплиментик", callback_data: "/compliment" }]],
    //   }),
    // }

    await bot.sendMessage(chatId, response, buttonOptions)

    if (chatId !== CREATOR_CHAT_ID) {
      await bot.sendMessage(
        CREATOR_CHAT_ID,
        `ℹ️ Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${command}" і отримав(-ла) відповідь "${response}"`
      )
    }
  } catch (err) {
    if (chatId !== CREATOR_CHAT_ID) {
      await bot.sendMessage(chatId, 'Я трошки зламався, скоро полагоджусь і повернусь 👨‍🔧⚙️😊')
    }

    await bot.sendMessage(
      CREATOR_CHAT_ID,
      `❌ Помилка! Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${command}" і виникла помилка "${
        err?.response?.data?.message ?? err
      }"`
    )
  }
}

async function handleUser({ firstName, lastName, username, chatId }) {
  const getAndUpdateUrl = `${DB_BASE_URL}/users/chatId/${chatId}`

  const { data } = await axios.get(getAndUpdateUrl)

  let response = null

  if (data) {
    response = await axios.patch(getAndUpdateUrl, { messages: data.messages + 1 })
  } else {
    response = await axios.post(`${DB_BASE_URL}/users`, {
      firstName,
      lastName,
      username,
      chatId,
    })

    await bot.sendMessage(
      CREATOR_CHAT_ID,
      `ℹ️ Нового користувача "${firstName} ${lastName} <${username}> (${chatId})" додано в базу даних`
    )
  }

  return response.data
}

module.exports = makeResponse
