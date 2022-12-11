const axios = require('axios')
const {
  getStartCmdResponse,
  getMessageResponse,
  getHelpCmdResponse,
  getElseResponse,
  separateFirstWord,
} = require('./helpers')
const { KOZUBSKYI_CHAT_ID, LENA_RAK_CHAT_ID, DB_BASE_URL } = process.env
const SWEET_CHAT_ID = Number(LENA_RAK_CHAT_ID)
const CREATOR_CHAT_ID = Number(KOZUBSKYI_CHAT_ID)

async function makeResponse(bot, { firstName, lastName, username, chatId, command }) {
  let response = ''
  let buttons = {}

  try {
    const user = await handleUser({ firstName, lastName, username, chatId, command })

    // user.status = 'others' //* ⬅️ for testing (creator, sweet, others)

    let cmdResp = {}

    if (command === '/start') cmdResp = getStartCmdResponse(user)
    else if (command === '/compliment' || command === '/wish')
      cmdResp = await getMessageResponse(user.status, command.slice(1))
    else if (command === '/help') cmdResp = await getHelpCmdResponse(user.status)
    else cmdResp = getElseResponse(user.status)

    response = cmdResp.response
    buttons = cmdResp.buttons ?? {}

    if (user.status === 'creator') {
      const [adminCommand, data] = separateFirstWord(command)

      if (adminCommand === 'add') {
        const [type, statusAndText] = separateFirstWord(data)
        const [status, text] = separateFirstWord(statusAndText)
        let forStatus
        status === 'all' ? (forStatus = ['sweet', 'creator', 'others']) : (forStatus = [status])

        const resp = await axios.post(`${DB_BASE_URL}/messages`, { type, for: forStatus, text })

        response = `✅ Компліментик додано в базу даних: ${JSON.stringify(resp.data)}`
      }
      if (adminCommand === 'addmessages') {
        await axios.post(`${DB_BASE_URL}/messages/all`, JSON.parse(data))

        response = '✅ Всі компліментики додано в базу даних'
      }
      if (adminCommand === 'del') {
        const resp = await axios.delete(`${DB_BASE_URL}/messages/text/${data}`)
        // Цікаве: при методі DELETE не передається body, інфу можна передавати лише черер params

        if (resp.data) {
          response = `✅ Компліментик видалено з бази даних: ${JSON.stringify(resp.data)}`
        } else {
          response = 'ℹ️ Такого компліментика і не було в базі даних'
        }
      }
      if (command === 'delallmessages') {
        await axios.delete(`${DB_BASE_URL}/messages`)

        response = '✅ Всі компліментики видалено з бази даних'
      }
      if (adminCommand === 'mlr') {
        await bot.sendMessage(SWEET_CHAT_ID, data)
        response = '✅ Повідомлення відправлено'
      }
      if (adminCommand === 'msg') {
        const [receiverChatId, text] = separateFirstWord(data)

        await bot.sendMessage(Number(receiverChatId), text)
        response = '✅ Повідомлення відправлено'
      }
      if (command === '/users') {
        const resp = await axios.get(`${DB_BASE_URL}/users`)

        response = JSON.stringify(resp.data)
      }
      if (command === '/messages') {
        const resp = await axios.get(`${DB_BASE_URL}/messages`)

        response = JSON.stringify(
          resp.data.map((message) => ({ type: message.type, text: message.text, for: message.for }))
        )
      }
      if (command === '/compliments') {
        const resp = await axios.get(`${DB_BASE_URL}/messages/compliment`)

        response = JSON.stringify(
          resp.data.map((compliment) => ({
            type: compliment.type,
            text: compliment.text,
            for: compliment.for,
          }))
        )
      }
      if (command === '/wishes') {
        const resp = await axios.get(`${DB_BASE_URL}/messages/wish`)

        response = JSON.stringify(resp.data.map((wish) => ({ type: wish.type, text: wish.text, for: wish.for })))
      }
      if (command === '/usersq') {
        const resp = await axios.get(`${DB_BASE_URL}/users`)

        response = resp.data.length
      }
      if (command === '/messagesq') {
        const resp = await axios.get(`${DB_BASE_URL}/messages`)

        response = resp.data.length
      }
      if (command === '/complimentsq') {
        const resp = await axios.get(`${DB_BASE_URL}/messages/compliment`)

        response = resp.data.length
      }
      if (command === '/wishesq') {
        const resp = await axios.get(`${DB_BASE_URL}/messages/wish`)

        response = resp.data.length
      }
      if (command === '/test') {
        response = '✅'
      }
    }

    await bot.sendMessage(chatId, response, buttons)

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
