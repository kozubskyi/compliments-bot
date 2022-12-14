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
    const [type, statusAndText] = separateFirstWord(rest);
    const [status, text] = separateFirstWord(statusAndText);

    const statuses = {
      sweet: ['sweet'],
      creator: ['creator'],
      others: ['others'],
      'not-sweet': ['creator', 'others'],
      'not-creator': ['sweet', 'others'],
      'not-others': ['sweet', 'creator'],
      all: ['sweet', 'creator', 'others'],
    };

    const resp = await axios.post(`${DB_BASE_URL}/messages`, { type, for: statuses[status], text });

    reply = `✅ Повідомлення додано в базу даних: ${JSON.stringify(resp.data)}`;
  } else if (command === 'show') {
    const [collection, id] = separateFirstWord(rest);

    const resp = await axios.get(`${DB_BASE_URL}/${collection}s/${id}`);

    reply = JSON.stringify(resp.data);
  } else if (command === 'del') {
    const [key, idOrText] = separateFirstWord(rest);

    const resp = await axios.delete(`${DB_BASE_URL}/messages/${key}/${idOrText}`);
    // Цікаве: при методі DELETE не передається body, інфу можна передавати лише черер params

    if (resp.data) {
      reply = `✅ Повідомлення видалено з бази даних: ${JSON.stringify(resp.data)}`;
    } else {
      reply = 'ℹ️ Такого повідомлення і не було в базі даних';
    }
  } else if (command === 'upd') {
    const [id, fieldAndNewValue] = separateFirstWord(rest);
    const [field, newValue] = separateFirstWord(fieldAndNewValue);

    const resp = await axios.patch(`${DB_BASE_URL}/messages/${id}`, {
      [field]: JSON.parse(newValue),
    });
    // Цікаве: при методі DELETE не передається body, інфу можна передавати лише черер params

    if (resp.data) {
      reply = `✅ Повідомлення оновлено у базі даних: ${JSON.stringify(resp.data)}`;
    } else {
      reply = '⚠️ Повідомлення з таким id немає в базі даних';
    }
  } else if (command === 'mlr') {
    await ctx.telegram.sendMessage(SWEET_CHAT_ID, rest);

    reply = '✅ Повідомлення відправлено';
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
  } else if (value === 'delallmessages') {
    await axios.delete(`${DB_BASE_URL}/messages`);

    reply = '✅ Всі компліментики видалено з бази даних';
  } else if (value === '/users') {
    const resp = await axios.get(`${DB_BASE_URL}/users`);

    reply = JSON.stringify(
      resp.data.map(({ _id, firstName, lastName }) => `${_id} - ${firstName} ${lastName}`)
    );
  } else if (value === '/messages') {
    const resp = await axios.get(`${DB_BASE_URL}/messages`);

    reply = JSON.stringify(resp.data.map(({ _id, text }) => `${_id} ${text}`));
  } else if (value === '/compliments') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/type/compliment`);

    reply = JSON.stringify(resp.data.map(({ _id, text }) => `${_id} ${text}`));
  } else if (value === '/wishes') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/type/wish`);

    reply = JSON.stringify(resp.data.map(({ _id, text }) => `${_id} ${text}`));
  } else if (value === '/usersq') {
    const resp = await axios.get(`${DB_BASE_URL}/users`);

    reply = resp.data.length;
  } else if (value === '/messagesq') {
    const resp = await axios.get(`${DB_BASE_URL}/messages`);

    reply = resp.data.length;
  } else if (value === '/complimentsq') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/compliment`);

    reply = resp.data.length;
  } else if (value === '/wishesq') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/wish`);

    reply = resp.data.length;
  } else if (value === '/resetsendings') {
    const resp = await axios.patch(`${DB_BASE_URL}/messages/reset/sendings`);

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
