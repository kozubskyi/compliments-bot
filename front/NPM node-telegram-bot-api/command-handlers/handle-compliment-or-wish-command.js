const axios = require('axios')
const { DB_BASE_URL } = process.env

async function getRandomMessage(type, status) {
  const { data } = await axios.get(`${DB_BASE_URL}/messages/${type}/${status}`)

  if (!data.length) {
    const variants = { compliment: 'компліментиків', wish: 'побажаннячок' }

    return { text: `Нажаль поки що я не маю ${variants[type]}, вибач 😥` }
  }

  const randomIndex = Math.floor(Math.random() * data.length)

  const chosenMessage = data[randomIndex]
  const { _id, sendings } = chosenMessage

  await axios.patch(`${DB_BASE_URL}/messages/${_id}`, { sendings: sendings + 1 })

  return chosenMessage
}

module.exports = async function handleComplimentOrWishCommand(status, type) {
  let response = ''
  let buttons = {
    reply_markup: JSON.stringify({
      inline_keyboard: [[{ text: '✨ Побажання', callback_data: '/wish' }]],
    }),
  }

  if (status !== 'sweet' && type === 'compliment') {
    response = 'Вибач, але компліменти я роблю лише Олені Рак. Для усіх інших я відправляю побажання.'
  } else {
    const { text } = await getRandomMessage(type, status)
    response = text

    if (status === 'sweet') {
      buttons = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: '💝 Компліментик', callback_data: '/compliment' },
              { text: '✨ Побажаннячко', callback_data: '/wish' },
            ],
          ],
        }),
      }
    }
  }

  return { response, buttons }
}
