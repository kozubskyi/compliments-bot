const axios = require('axios');
const { DB_BASE_URL } = process.env;
const { SWEET_CHAT_ID } = require('../helpers/variables');

function separateFirstWord(msg) {
  const msgArr = msg.split(' ');
  const cmd = msgArr[0];
  const text = msgArr.slice(1).join(' ');

  return [cmd, text];
}

async function handleCreatorCommands(bot, command) {
  let response = '';

  const [adminCommand, rest] = separateFirstWord(command);

  if (adminCommand === 'add') {
    const [type, statusAndText] = separateFirstWord(rest);
    const [status, text] = separateFirstWord(statusAndText);
    let forStatus;
    status === 'all' ? (forStatus = ['sweet', 'creator', 'others']) : (forStatus = [status]);

    const resp = await axios.post(`${DB_BASE_URL}/messages`, { type, for: forStatus, text });

    response = `✅ Повідомлення додано в базу даних: ${JSON.stringify(resp.data)}`;
  } else if (adminCommand === 'addmessages') {
    await axios.post(`${DB_BASE_URL}/messages/all`, JSON.parse(rest));

    response = '✅ Всі компліментики додано в базу даних';
  } else if (adminCommand === 'del') {
    const [key, idOrText] = separateFirstWord(rest);

    const resp = await axios.delete(`${DB_BASE_URL}/messages/${key}/${idOrText}`);
    // Цікаве: при методі DELETE не передається body, інфу можна передавати лише черер params

    if (resp.data) {
      response = `✅ Повідомлення видалено з бази даних: ${JSON.stringify(resp.data)}`;
    } else {
      response = 'ℹ️ Такого повідомлення і не було в базі даних';
    }
  } else if (command === 'delallmessages') {
    await axios.delete(`${DB_BASE_URL}/messages`);

    response = '✅ Всі компліментики видалено з бази даних';
  } else if (adminCommand === 'upd') {
    const [id, data] = separateFirstWord(rest);

    const resp = await axios.patch(`${DB_BASE_URL}/messages/${id}`, JSON.parse(data));
    // Цікаве: при методі DELETE не передається body, інфу можна передавати лише черер params

    if (resp.data) {
      response = `✅ Повідомлення оновлено у базі даних: ${JSON.stringify(resp.data)}`;
    } else {
      response = '⚠️ Повідомлення з таким id немає в базі даних';
    }
  } else if (adminCommand === 'mlr') {
    await bot.sendMessage(SWEET_CHAT_ID, rest);
    response = '✅ Повідомлення відправлено';
  } else if (adminCommand === 'msg') {
    const [name, surnameAndText] = separateFirstWord(rest);
    const [surname, text] = separateFirstWord(surnameAndText);

    const { data } = await axios.get(`${DB_BASE_URL}/users/${name}/${surname}`);

    if (data) {
      await bot.sendMessage(data.chatId, text);
      response = '✅ Повідомлення відправлено';
    } else {
      response = '⚠️ Такого користувача немає у базі даних';
    }
  } else if (command === '/users') {
    const resp = await axios.get(`${DB_BASE_URL}/users`);

    response = JSON.stringify(
      resp.data.map(({ firstName, lastName, username, chatId, messages }) => ({
        firstName,
        lastName,
        username,
        chatId,
        messages,
      }))
    );
  } else if (command === '/messages') {
    const resp = await axios.get(`${DB_BASE_URL}/messages`);

    response = JSON.stringify(
      resp.data.map(message => ({ type: message.type, text: message.text, for: message.for }))
    );
  } else if (command === '/compliments') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/compliment`);

    response = JSON.stringify(
      resp.data.map(compliment => ({
        type: compliment.type,
        text: compliment.text,
        for: compliment.for,
      }))
    );
  } else if (command === '/wishes') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/wish`);

    response = JSON.stringify(
      resp.data.map(wish => ({ type: wish.type, text: wish.text, for: wish.for }))
    );
  } else if (command === '/usersfull') {
    const resp = await axios.get(`${DB_BASE_URL}/users`);

    response = JSON.stringify(resp.data);
  } else if (command === '/messagesfull') {
    const resp = await axios.get(`${DB_BASE_URL}/messages`);

    response = JSON.stringify(resp.data);
  } else if (command === '/complimentsfull') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/compliment`);

    response = JSON.stringify(resp.data);
  } else if (command === '/wishesfull') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/wish`);

    response = JSON.stringify(resp.data);
  } else if (command === '/usersquantity') {
    const resp = await axios.get(`${DB_BASE_URL}/users`);

    response = resp.data.length;
  } else if (command === '/messagesquantity') {
    const resp = await axios.get(`${DB_BASE_URL}/messages`);

    response = resp.data.length;
  } else if (command === '/complimentsquantity') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/compliment`);

    response = resp.data.length;
  } else if (command === '/wishesquantity') {
    const resp = await axios.get(`${DB_BASE_URL}/messages/wish`);

    response = resp.data.length;
  } else if (command === '/resetsendings') {
    const resp = await axios.patch(`${DB_BASE_URL}/messages/reset/sendings`);

    response = '✅ Поле sendings усіх повідомлень успішно скинуто до 0';
  } else if (command === '/test') {
    response = '✅';
  } else {
    response = '⚠️ Некоректна команда';
  }

  return response;
}

module.exports = async function handleElseCommands(bot, status, command) {
  let response = '';

  if (status === 'sweet') {
    response = 'Я передам Денису те, що ти написала) 😘';
  } else if (status === 'creator') {
    response = await handleCreatorCommands(bot, command);
  } else {
    response = 'Я передам Денису це повідомлення 😉';
  }

  return { response };
};
