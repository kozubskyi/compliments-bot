const axios = require('axios');
const helpers = require('./helpers');
const { KOZUBSKYI_CHAT_ID, LENA_RAK_CHAT_ID, DB_BASE_URL } = process.env;
const SWEET_CHAT_ID = Number(LENA_RAK_CHAT_ID);
const CREATOR_CHAT_ID = Number(KOZUBSKYI_CHAT_ID);

async function makeResponse(bot, { firstName, lastName, username, chatId, command }) {
  try {
    let response = '';
    let buttons = {};

    const user = await handleUser({ firstName, lastName, username, chatId, command });

    // user.status = 'sweet'; //* ⬅️ for testing (creator, sweet, others)

    let cmdResp = {};

    if (command === '/start') {
      cmdResp = helpers.handleStartCommand(user);
    } else if (command === '/compliment' || command === '/wish') {
      cmdResp = await helpers.handleComplimentOrWishCommand(user.status, command.slice(1));
    } else if (command === '/help') {
      cmdResp = await helpers.handleHelpCommand(user.status);
    } else {
      cmdResp = await helpers.handleElseCommands(user.status, command);
    }

    response = cmdResp.response;
    buttons = cmdResp.buttons ?? {};

    await bot.sendMessage(chatId, response, buttons);

    chatId !== CREATOR_CHAT_ID &&
      (await bot.sendMessage(
        CREATOR_CHAT_ID,
        `ℹ️ Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${command}" і отримав(-ла) відповідь "${response}"`
      ));
  } catch (err) {
    chatId !== CREATOR_CHAT_ID &&
      (await bot.sendMessage(chatId, 'Я трошки зламався, скоро полагоджусь і повернусь 👨‍🔧⚙️😊'));

    await bot.sendMessage(
      CREATOR_CHAT_ID,
      `❌ Помилка! Користувач "${firstName} ${lastName} <${username}> (${chatId})" відправив(-ла) повідомлення "${command}" і виникла помилка "${
        err?.response?.data?.message ?? err
      }"`
    );
  }
}

async function handleUser({ firstName, lastName, username, chatId }) {
  const getOrUpdateUrl = `${DB_BASE_URL}/users/chatId/${chatId}`;

  const { data } = await axios.get(getOrUpdateUrl);

  let response = null;

  if (data) {
    response = await axios.patch(getOrUpdateUrl, { messages: data.messages + 1 });
  } else {
    response = await axios.post(`${DB_BASE_URL}/users`, {
      firstName,
      lastName,
      username,
      chatId,
    });

    await bot.sendMessage(
      CREATOR_CHAT_ID,
      `ℹ️ Нового користувача "${firstName} ${lastName} <${username}> (${chatId})" додано в базу даних`
    );
  }

  return response.data;
}

module.exports = makeResponse;
