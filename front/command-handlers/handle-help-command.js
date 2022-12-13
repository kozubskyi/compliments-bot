module.exports = function handleHelpCommand(status) {
  let response = ''
  const buttons = {}

  if (status === 'creator') {
    response = `🗣️ Команди

💁‍♂️ Стандарті:
/start - отримати привітання від бота
/compliment - отримати комплімент від бота
/wish - отримати побажання від бота
/help - отримати список усіх можливих команд

⭐️ Адміністраторські:
- add <type> <for> <text> - додати у базу даних нове повідомлення з type: compliment/wish, for: sweet/creator/others і будь-яким текстом <text>;
- show <collection> <id> - отримати повну інформацію про об'єкт колекції <collection> з id <id>;
- del <key> <idOrText> - видалити з бази даних повідомлення з полем <key> (id або text) та значенням цього поля <idOrText>;
- upd <id> <field> <value> - оновити поле <field> повідомлення з id <id> в базі даних новим значенням <value>;
- mlr <text> - відправити повідомлення Олені Рак з текстом <text>;
- msg <name> <surname> <text> - відправити повідомлення користувачу, який є у базі даних, з ім'ям <name>, прізвищем <surname> і текстом <text>;
- delallmessages - видалити всі повідомлення з бази даних (не рекомендовано);
/users - отримати масив усіх користувачів з бази даних у форматі "id - name surname";
/messages - отримати масив усіх повідомлень з бази даних у форматі "id text";
/compliments - отримати масив усіх компліментів з бази даних у форматі "id text";
/wishes - отримати масив усіх побажань з бази даних у форматі "id text";
/usersq - отримати кількість усіх користувачів у базі даних;
/messagesq - отримати кількість усіх повідомлень у базі даних;
/complimentsq - отримати кількість усіх компліментів у базі даних;
/wishesq - отримати кількість усіх побажань у базі даних;
/resetsendings - скинути поле sendings усіх повідомлень до 0;
/test - тестова команда.`

    // Deleted commands:
    // addmessages <array> - додати в базу даних масив нових повідомлень, де кожне повідомлення повинно містити { type, for, text };
    // /messagesfull - отримати масив усіх повідомлень з бази даних зі всіма даними;
    // /resetsendings - скинути поле sendings усіх повідомлень до 0;
  } else {
    response = `🗣️ Команди

/start - отримати привітання від бота
/compliment - отримати комплімент від бота
/wish - отримати побажання від бота
/help - отримати список усіх можливих команд

Також можеш просто написати повідомлення, а я передам його Денису`

    buttons = {
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
  }

  return { response, buttons }
}
