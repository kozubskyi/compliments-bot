const commands = require('../helpers/commands')
const { CREATOR_CHAT_ID } = require('../helpers/constants')

module.exports = function handleHelpCommand(status, chatId) {
  let reply = ''

  if (status === 'creator' && chatId === CREATOR_CHAT_ID) {
    reply = commands.admin
  } else {
    reply = commands.standart
  }

  return reply
}
