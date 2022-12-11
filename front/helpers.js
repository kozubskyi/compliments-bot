const axios = require('axios')
const { DB_BASE_URL } = process.env

function getStartCmdResponse(status) {
  let response = ''
  let buttons = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: 'Компліментик', callback_data: '/compliment' },
          { text: 'Побажаннячко', callback_data: '/wish' },
        ],
      ],
    }),
  }

  if (status === 'sweet') {
    response =
      'Лєнусічка, привіт) 😊 Денис просив передати тобі багато компліментиків та побажаннячок. Натисни на потрібну кнопку, або напиши /compliment чи /wish 😘'
  } else if (status === 'creator') {
    response = 'Привіт, творець) працюю коректно 😊'
  } else {
    response = 'Привіт 😊 для отримання побажання натисніть кнопку або відправте повідомлення з текстом /wish'
    buttons = {
      reply_markup: JSON.stringify({
        inline_keyboard: [[{ text: 'Побажання', callback_data: '/wish' }]],
      }),
    }
  }

  return { response, buttons }
}

async function getRandomCompliment(status) {
  let response = null

  if (status) {
    response = await axios.get(`${DB_BASE_URL}/compliments/${status}`)
  } else {
    response = await axios.get(`${DB_BASE_URL}/compliments`)
  }
  const randomIndex = Math.floor(Math.random() * response.data.length)

  const chosenCompliment = response.data[randomIndex]
  const { _id, sendings } = chosenCompliment

  await axios.patch(`${DB_BASE_URL}/compliments/${_id}`, { sendings: sendings + 1 })

  return chosenCompliment
}

async function getComplimentCmdResponse(status) {
  let chosenCompliment = null

  if (status === 'sweet' || status === 'creator') {
    chosenCompliment = await getRandomCompliment(status)
  } else {
    chosenCompliment = await getRandomCompliment('others')
  }

  return { response: chosenCompliment.text }
}

function getElseResponse(status) {
  let response = null

  if (status === 'sweet') response = 'Я передам Денису те, що ти написала) 😘'
  else if (status === 'creator') response = '⚠️ Некоректна команда'
  else response = 'Я передам Денису те, що Ви написали 😉'

  return response
}

function separateCommand(msg) {
  const msgArr = msg.split(' ')
  const cmd = msgArr[0]
  const text = msgArr.slice(1).join(' ')

  return [cmd, text]
}

module.exports = {
  getStartCmdResponse,
  getComplimentCmdResponse,
  getElseResponse,
  separateCommand,
}
