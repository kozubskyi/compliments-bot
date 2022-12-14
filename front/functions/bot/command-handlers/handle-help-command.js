const commands = require('../helpers/commands')

module.exports = function handleHelpCommand(status) {
  let response = ''
  let buttons = {}

  if (status === 'creator') {
    response = commands.admin
  } else {
    response = commands.standart

    const complimentText = status === 'sweet' ? '💝 Компліментик' : '💝 Комплімент'
    const wishText = status === 'sweet' ? '✨ Побажаннячко' : '✨ Побажання'

    buttons = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{ text: complimentText, callback_data: '/compliment' }],
          [{ text: wishText, callback_data: '/wish' }],
          [
            { text: '👋 Привітання', callback_data: '/start' },
            { text: '❔ Допомога', callback_data: '/help' },
          ],
        ],
      }),
    }
  }

  return { response, buttons }
}
