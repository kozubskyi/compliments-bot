const handleUser = require('./helpers/handle-user');
const commandHandlers = require('./command-handlers');
const { CREATOR_CHAT_ID } = require('./helpers/variables');

async function makeResponse(bot, { firstName, lastName, username, chatId, command }) {
  try {
    let response = '';
    let buttons = {};

    const user = await handleUser({ firstName, lastName, username, chatId, command });

    // user.status = 'sweet'; //* ⬅️ for testing (creator, sweet, others)

    let cmdResp = {};

    if (command === '/start') {
      cmdResp = commandHandlers.handleStartCommand(user);
    } else if (command === '/compliment' || command === '/wish') {
      cmdResp = await commandHandlers.handleComplimentOrWishCommand(user.status, command.slice(1));
    } else if (command === '/help') {
      cmdResp = await commandHandlers.handleHelpCommand(user.status);
    } else {
      cmdResp = await commandHandlers.handleElseCommands(bot, user.status, command);
    }

    response = cmdResp.response;
    buttons = cmdResp.buttons ?? {};

    await bot.sendMessage(chatId, response, buttons);

    const creatorSuccessMessage = `ℹ️ Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${command}" і отримав(-ла) відповідь "${response}"`;

    chatId !== CREATOR_CHAT_ID && (await bot.sendMessage(CREATOR_CHAT_ID, creatorSuccessMessage));
  } catch (err) {
    const userErrorMessage = 'Я трошки зламався, скоро полагоджусь і повернусь 👨‍🔧⚙️😊';

    chatId !== CREATOR_CHAT_ID && (await bot.sendMessage(chatId, userErrorMessage));

    const creatorErrorMessage = `❌ Помилка! Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${command}" і виникла помилка "${
      err?.response?.data?.message ?? err
    }"`;

    await bot.sendMessage(CREATOR_CHAT_ID, creatorErrorMessage);
  }
}

module.exports = makeResponse;
