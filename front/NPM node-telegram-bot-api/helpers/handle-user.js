const axios = require('axios')
const { DB_BASE_URL } = process.env
const { CREATOR_CHAT_ID, SWEET_CHAT_ID } = require('./variables')

module.exports = async function handleUser(bot, { firstName, lastName, username, chatId }) {
  const getOrUpdateUrl = `${DB_BASE_URL}/users/chatId/${chatId}`

  const { data } = await axios.get(getOrUpdateUrl)

  let response = null

  if (data) {
    response = await axios.patch(getOrUpdateUrl, { messages: data.messages + 1 })
  } else {
    let status = ''
    if (chatId === CREATOR_CHAT_ID) {
      status = 'creator'
    } else if (chatId === SWEET_CHAT_ID) {
      status = 'sweet'
    } else {
      status = 'others'
    }

    response = await axios.post(`${DB_BASE_URL}/users`, {
      firstName,
      lastName,
      username,
      chatId,
      status,
    })

    chatId !== CREATOR_CHAT_ID &&
      (await bot.sendMessage(
        CREATOR_CHAT_ID,
        `ℹ️ Нового користувача "${firstName} ${lastName} <${username}> (${chatId})" додано в базу даних`
      ))
  }

  return response.data
}
