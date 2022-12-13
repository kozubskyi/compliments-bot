module.exports = function handleHelpCommand(status) {
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
del <key> <idOrText> - видалити з бази даних повідомлення з полем <key> (id або text) та значенням цього поля <idOrText>;
delallmessages - видалити всі повідомлення з бази даних (не рекомендовано);
upd <id> <field> <value> - оновити поле <field> повідомлення з id <id> в базі даних новим значенням <value>;
mlr <text> - відправити повідомлення Олені Рак з текстом <text>;
msg <name> <surname> <text> - відправити повідомлення користувачу, який є у базі даних, з ім'ям <name>, прізвищем <surname> і текстом <text>;
/users - отримати масив усіх користувачів з бази даних;
/messages - отримати масив усіх повідомлень з бази даних у форматі { type, for, text };
/compliments - отримати масив усіх компліментів з бази даних у форматі { type: 'compliment', for, text };
/wishes - отримати масив усіх побажань з бази даних у форматі { type: 'wish', for, text };
/usersfull - отримати масив усіх користувачів з бази даних зі всіма данними;
/messagesfull - отримати масив усіх повідомлень з бази даних зі всіма даними;
/complimentsfull - отримати масив усіх компліментів з бази даних зі всіма даними;
/wishesfull - отримати масив усіх побажань з бази даних зі всіма даними;
/usersquantity - отримати кількість усіх користувачів у базі даних;
/messagesquantity - отримати кількість усіх повідомлень у базі даних;
/complimentsquantity - отримати кількість усіх компліментів у базі даних;
/wishesquantity - отримати кількість усіх побажань у базі даних;
/resetsendings - скинути поле sendings усіх повідомлень до 0;
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
