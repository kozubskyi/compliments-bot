const axios = require('axios');
const { DB_BASE_URL } = process.env;
const { SWEET_CHAT_ID } = require('../helpers/chat-ids');

function separateFirstWord(msg) {
  const msgArr = msg.split(' ');
  const cmd = msgArr[0];
  const text = msgArr.slice(1).join(' ');

  return [cmd, text];
}

async function handleCreatorCommands(ctx, value) {
  let reply = '';

  const [command, rest] = separateFirstWord(value);

  if (command === 'add') {
    const { data } = await axios.post(`${DB_BASE_URL}/compliments`, { text: rest });

    reply = `✅ Компліментик додано в базу даних: ${JSON.stringify(data)}`;
  } else if (command === 'show') {
    const { data } = await axios.get(`${DB_BASE_URL}/compliments/${rest}`);

    reply = JSON.stringify(data);
  } else if (command === 'del') {
    const [key, idOrText] = separateFirstWord(rest);

    const { data } = await axios.delete(`${DB_BASE_URL}/compliments/${key}/${idOrText}`);

    if (data) {
      reply = `✅ Компліментик успішно видалено з бази даних: ${JSON.stringify(data)}`;
    } else {
      reply = 'ℹ️ Такого компліментика і не було у базі даних';
    }
  } else if (command === 'upd') {
    const [id, fieldAndNewValue] = separateFirstWord(rest);
    const [field, newValue] = separateFirstWord(fieldAndNewValue);

    const { data } = await axios.patch(`${DB_BASE_URL}/compliments/${id}`, {
      [field]: JSON.parse(newValue),
    });

    if (data) {
      reply = `✅ Компліментик успішно оновлено у базі даних: ${JSON.stringify(data)}`;
    } else {
      reply = `⚠️ Компліментика з id ${id} немає в базі даних`;
    }
  } else if (command === 'mlr') {
    await ctx.telegram.sendMessage(SWEET_CHAT_ID, rest);

    reply = '✅ Повідомлення Лєнусічкє відправлено';
  } else if (command === 'msg') {
    const [name, surnameAndText] = separateFirstWord(rest);
    const [surname, text] = separateFirstWord(surnameAndText);

    const { data } = await axios.get(`${DB_BASE_URL}/users/${name}/${surname}`);

    if (data) {
      await ctx.telegram.sendMessage(data.chatId, text);
      reply = '✅ Повідомлення відправлено';
    } else {
      reply = '⚠️ Такого користувача немає у базі даних';
    }
  } else if (value === 'delallcompliments') {
    await axios.delete(`${DB_BASE_URL}/compliments`);

    reply = '✅ Всі компліментики видалено з бази даних';
  } else if (value === '/users') {
    const { data } = await axios.get(`${DB_BASE_URL}/users`);

    reply = JSON.stringify(data);
  } else if (value === '/compliments') {
    const { data } = await axios.get(`${DB_BASE_URL}/compliments`);

    reply = JSON.stringify(data.map(({ _id, text }) => `${_id} ${text}`));
  } else if (value === '/usersq') {
    const { data } = await axios.get(`${DB_BASE_URL}/users`);

    reply = `${data.length}`;
  } else if (value === '/complimentsq') {
    const { data } = await axios.get(`${DB_BASE_URL}/compliments`);

    reply = `${data.length}`;
  } else if (value === '/sendingsreset') {
    await axios.patch(`${DB_BASE_URL}/compliments/sendings/reset`);

    reply = '✅ Поле sendings усіх повідомлень успішно скинуто до 0';
  } else if (value === '/test') {
    reply = '✅';
  } else {
    reply = '⚠️ Некоректна команда';
  }

  return reply;
}

module.exports = async function handleElseCommands(ctx, status, value) {
  let reply = '';

  if (status === 'creator') {
    reply = await handleCreatorCommands(ctx, value);
  } else if (status === 'sweet') {
    reply = 'Я передам Денису те, що ти написала) 😘';
  } else {
    reply = 'Я передам Денису це повідомлення 😉';
  }

  return reply;
};
