module.exports = function handleStartCommand({ status, firstName }) {
  let reply = '';

  if (status === 'sweet') {
    reply =
      'Лєнусічка, привіт) 😊 Денис просив передати тобі багато компліментиків та побажаннячок) ☺️ Відправ повідомлення з текстом /compliment чи /wish 😘';
  } else {
    reply = `Привіт, ${firstName} 👋 для отримання побажання відправ повідомлення з текстом /wish 😊`;
  }

  return reply;
};
