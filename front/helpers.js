const axios = require('axios')
const { DB_BASE_URL } = process.env

function getStartCmdResponse({ firstName, status }) {
  let response = ''
  const buttons = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: '💝 Компліментик', callback_data: '/compliment' }],
        [{ text: '✨ Побажаннячко', callback_data: '/wish' }],
        [
          { text: '👋 Привітання', callback_data: '/start' },
          { text: '❔ Допомога', callback_data: '/help' },
        ],
      ],
    }),
  }

  if (status === 'sweet') {
    response =
      'Лєнусік, привіт) 😊 Денис просив передати тобі багато компліментиків та побажаннячок) ☺️ Натисни на потрібну кнопку, або напиши /compliment чи /wish 😘'
  } else if (status === 'creator') {
    response = 'Привіт, творець) працюю коректно 😊'
  } else {
    response = `Привіт, ${firstName} 👋 для отримання побажання натисни на кнопку або відправ повідомлення з текстом /wish 😊`
  }

  return { response, buttons }
}

async function getRandomMessage(type, status) {
  const { data } = await axios.get(`${DB_BASE_URL}/messages/${type}/${status}`)

  const randomIndex = Math.floor(Math.random() * data.length)

  const chosenMessage = data[randomIndex]
  const { _id, sendings } = chosenMessage

  await axios.patch(`${DB_BASE_URL}/messages/${_id}`, { sendings: sendings + 1 })

  return chosenMessage
}

async function getMessageResponse(status, type) {
  let response = ''
  const buttons = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: '💝 Компліментик', callback_data: '/compliment' },
          { text: '✨ Побажаннячко', callback_data: '/wish' },
        ],
      ],
    }),
  }

  if (status !== 'sweet' && type === 'compliment') {
    response = 'Вибач, але компліментики я роблю лише Олені Рак. Для усіх інших я відправляю побажання.'
  } else {
    const chosenMessage = await getRandomMessage(type, status)
    response = chosenMessage.text
  }

  return { response, buttons }
}

function getHelpCmdResponse(status) {
  let response = ''
  const buttons = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: '💝 Компліментик', callback_data: '/compliment' }],
        [{ text: '✨ Побажаннячко', callback_data: '/wish' }],
        [
          { text: '👋 Привітання', callback_data: '/start' },
          { text: '❔ Допомога', callback_data: '/help' },
        ],
      ],
    }),
  }

  if (status === 'creator') {
    response = `🗣️ Команди

💁‍♂️ Стандарті:
/start - отримати привітання від бота
/compliment - отримати комплімент від бота
/wish - отримати побажання від бота
/help - отримати список усіх можливих команд

⭐️ Адміністраторські:
add <type> <for> <text> - додати у базу даних нове повідомлення з type: compliment/wish, for: sweet/creator/others і будь-яким текстом <text>;
addmessages <array> - додати в базу даних масив нових повідомлень, де кожне повідомлення повинно містити { type, for, text }
del <text> - видалити з бази даних повідомлення з текстом <text>;
delallmessages - видалити всі повідомлення з бази даних (не рекомендовано);
mlr <text> - відправити повідомлення Олені Рак з текстом <text>;
msg <chatId> <text> - відправити повідомлення користувачу з chatId <chatId> і текстом <text>;
/users - отримати масив усіх користувачів з бази даних;
/messages - отримати масив усіх повідомлень з бази даних у форматі { type, for, text };
/compliments - отримати масив усіх компліментів з бази даних у форматі { type: 'compliment', for, text };
/wishes - отримати масив усіх побажань з бази даних у форматі { type: 'wish', for, text };
/usersq - отримати кількість усіх користувачів у базі даних;
/messagesq - отримати кількість усіх повідомлень у базі даних;
/complimentsq - отримати кількість усіх компліментів у базі даних;
/wishesq - отримати кількість усіх побажань у базі даних;
/test - тестова команда.`
  } else {
    response = `🗣️ Команди

/start - отримати привітання від бота
/compliment - отримати комплімент від бота
/wish - отримати побажання від бота
/help - отримати список усіх можливих команд
Також можеш просто написати повідомлення, а я передам його Денису`
  }

  return { response, buttons }
}

function getElseResponse(status) {
  let response = ''

  if (status === 'sweet') response = 'Я передам Денису те, що ти написала) 😘'
  else if (status === 'creator') response = '⚠️ Некоректна команда'
  else response = 'Я передам Денису це повідомлення 😉'

  return { response }
}

function separateFirstWord(msg) {
  const msgArr = msg.split(' ')
  const cmd = msgArr[0]
  const text = msgArr.slice(1).join(' ')

  return [cmd, text]
}

module.exports = {
  getStartCmdResponse,
  getMessageResponse,
  getHelpCmdResponse,
  getElseResponse,
  separateFirstWord,
}
