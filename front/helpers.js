const axios = require('axios');
const { DB_BASE_URL } = process.env;

function handleStartCommand({ firstName, status }) {
  let response = '';
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
  };

  if (status === 'sweet') {
    response =
      'Лєнусік, привіт) 😊 Денис просив передати тобі багато компліментиків та побажаннячок) ☺️ Натисни на потрібну кнопку, або напиши /compliment чи /wish 😘';
  } else if (status === 'creator') {
    response = 'Привіт, творець) працюю коректно 😊';
  } else {
    response = `Привіт, ${firstName} 👋 для отримання побажання натисни на кнопку або відправ повідомлення з текстом /wish 😊`;
  }

  return { response, buttons };
}

async function getRandomMessage(type, status) {
  const { data } = await axios.get(`${DB_BASE_URL}/messages/${type}/${status}`);

  const randomIndex = Math.floor(Math.random() * data.length);

  const chosenMessage = data[randomIndex];
  const { _id, sendings } = chosenMessage;

  await axios.patch(`${DB_BASE_URL}/messages/${_id}`, { sendings: sendings + 1 });

  return chosenMessage;
}

async function handleComplimentOrWishCommand(status, type) {
  let response = '';

  if (status !== 'sweet' && type === 'compliment') {
    response =
      'Вибач, але компліментики я роблю лише Олені Рак. Для усіх інших я відправляю побажання.';
  } else {
    const chosenMessage = await getRandomMessage(type, status);
    response = chosenMessage.text;
  }

  return { response };
}

function handleHelpCommand(status) {
  let response = '';
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
  };

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
/resetsendings - скинути поле sendings усіх повідомлень до 0;
/test - тестова команда.`;
  } else {
    response = `🗣️ Команди

/start - отримати привітання від бота
/compliment - отримати комплімент від бота
/wish - отримати побажання від бота
/help - отримати список усіх можливих команд
Також можеш просто написати повідомлення, а я передам його Денису`;
  }

  return { response, buttons };
}

async function handleElseCommands(status, command) {
  let response = '';

  if (status === 'sweet') {
    response = 'Я передам Денису те, що ти написала) 😘';
  } else if (status === 'creator') {
    const [adminCommand, rest] = separateFirstWord(command);

    if (adminCommand === 'add') {
      const [type, statusAndText] = separateFirstWord(rest);
      const [status, text] = separateFirstWord(statusAndText);
      let forStatus;
      status === 'all' ? (forStatus = ['sweet', 'creator', 'others']) : (forStatus = [status]);

      const resp = await axios.post(`${DB_BASE_URL}/messages`, { type, for: forStatus, text });

      response = `✅ Компліментик додано в базу даних: ${JSON.stringify(resp.data)}`;
    } else if (adminCommand === 'addmessages') {
      await axios.post(`${DB_BASE_URL}/messages/all`, JSON.parse(rest));

      response = '✅ Всі компліментики додано в базу даних';
    } else if (adminCommand === 'del') {
      const resp = await axios.delete(`${DB_BASE_URL}/messages/text/${rest}`);
      // Цікаве: при методі DELETE не передається body, інфу можна передавати лише черер params

      if (resp.data) {
        response = `✅ Компліментик видалено з бази даних: ${JSON.stringify(resp.data)}`;
      } else {
        response = 'ℹ️ Такого компліментика і не було в базі даних';
      }
    } else if (command === 'delallmessages') {
      await axios.delete(`${DB_BASE_URL}/messages`);

      response = '✅ Всі компліментики видалено з бази даних';
    } else if (adminCommand === 'mlr') {
      await bot.sendMessage(SWEET_CHAT_ID, rest);
      response = '✅ Повідомлення відправлено';
    } else if (adminCommand === 'msg') {
      const [receiverChatId, text] = separateFirstWord(rest);

      await bot.sendMessage(Number(receiverChatId), text);
      response = '✅ Повідомлення відправлено';
    } else if (command === '/users') {
      const resp = await axios.get(`${DB_BASE_URL}/users`);

      response = JSON.stringify(resp.data);
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
    } else if (command === '/usersq') {
      const resp = await axios.get(`${DB_BASE_URL}/users`);

      response = resp.data.length;
    } else if (command === '/messagesq') {
      const resp = await axios.get(`${DB_BASE_URL}/messages`);

      response = resp.data.length;
    } else if (command === '/complimentsq') {
      const resp = await axios.get(`${DB_BASE_URL}/messages/compliment`);

      response = resp.data.length;
    } else if (command === '/wishesq') {
    } else if (command === '/resetsendings') {
      const resp = await axios.patch(`${DB_BASE_URL}/messages/reset/sendings`);

      response = '✅ Поле sendings усіх повідомлень успішно скинуто до 0';
    } else if (command === '/test') {
      response = '✅';
    } else {
      response = '⚠️ Некоректна команда';
    }
  } else {
    response = 'Я передам Денису це повідомлення 😉';
  }

  return { response };
}

function separateFirstWord(msg) {
  const msgArr = msg.split(' ');
  const cmd = msgArr[0];
  const text = msgArr.slice(1).join(' ');

  return [cmd, text];
}

module.exports = {
  handleStartCommand,
  handleComplimentOrWishCommand,
  handleHelpCommand,
  handleElseCommands,
};
