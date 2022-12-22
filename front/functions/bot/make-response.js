const handleUser = require('./helpers/handle-user')
const commandHandlers = require('./command-handlers')
const { BOT_USERNAME, CREATOR_USERNAME, CREATOR_CHAT_ID } = require('./helpers/constants')

async function makeResponse(ctx, msgData) {
  const { firstName, lastName, username, chatId, value } = msgData

  let reply = ''

  try {
    const user = await handleUser(ctx, { firstName, lastName, username, chatId })

    // user.status = 'sweet'; //* ⬅️ for testing (creator, sweet, others)

    if (value === '/start' || value === `/start@${BOT_USERNAME}`) {
      reply = commandHandlers.handleStartCommand(user)
    } else if (value === '/compliment' || value === `/compliment@${BOT_USERNAME}`) {
      reply = await commandHandlers.handleComplimentCommand(user.status)
    } else if (value === '/help' || value === `/help@${BOT_USERNAME}`) {
      reply = await commandHandlers.handleHelpCommand(user)
    } else {
      reply = await commandHandlers.handleElseCommands(ctx, user.status, value)
    }

    await ctx.replyWithHTML(reply)

    username !== CREATOR_USERNAME &&
      (await ctx.telegram.sendMessage(
        CREATOR_CHAT_ID,
        `ℹ️ Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${value}" і отримав(-ла) відповідь "${reply}"`
      ))
  } catch (err) {
    username !== CREATOR_USERNAME && (await ctx.reply('Я трошки зламався, скоро полагоджусь і повернусь 👨‍🔧⚙️😊'))

    await ctx.telegram.sendMessage(
      CREATOR_CHAT_ID,
      `❌ Помилка! Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${value}" і виникла помилка "${
        err?.response?.data?.message ?? err
      }"`
    )
  }
}

module.exports = makeResponse
