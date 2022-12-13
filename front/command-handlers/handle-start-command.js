module.exports = function handleStartCommand({ firstName, status }) {
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
};
