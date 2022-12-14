module.exports = function handleStartCommand({ status, firstName }) {
  let reply = '';

  if (status === 'sweet') {
    reply =
      'Лєнусічка, привіт) 😊 Денис просив передати тобі багато компліментиків та побажаннячок) ☺️ Натисни на потрібну кнопку, або напиши /compliment чи /wish 😘';
  } else {
    reply = `Привіт, ${firstName} 👋 для отримання побажання натисни на кнопку або відправ повідомлення з текстом /wish 😊`;
  }

  return reply;
};
