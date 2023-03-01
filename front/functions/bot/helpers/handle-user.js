require('dotenv').config() // чомусь без dotenv конфігурації не працювало, DB_BASE_URL був undefined
const axios = require('axios')
const { DB_BASE_URL } = process.env
const { CREATOR_USERNAME, CREATOR_CHAT_ID, SWEET_CHAT_ID } = require('./constants')

module.exports = async function handleUser(ctx, userData) {
  const { firstName, lastName, username, chatId } = userData

  const getOrUpdateUrl = `${DB_BASE_URL}/users/username/${username}`

  const { data } = await axios.get(getOrUpdateUrl)

  let response = {}

  if (data) {
    response = await axios.patch(getOrUpdateUrl, {
      messages: data.messages + 1,
      lastMessage: Date.now(),
    })
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

    username !== CREATOR_USERNAME &&
      (await ctx.telegram.sendMessage(
        CREATOR_CHAT_ID,
        `ℹ️ Нового користувача "${firstName} ${lastName} <${username}> (${chatId})" додано в базу даних`
      ))
  }

  return response.data
}
