module.exports = function handleStartCommand({ status, firstName }) {
  let reply = '';

  if (status === 'sweet') {
    reply =
      'Лєнусік, привіт) 😊 Денис просив передати тобі багато компліментиків) ☺️ Відправ повідомлення з текстом /compliment 😘';
  } else {
    reply = `Привіт, ${firstName} 👋 чим можу допомогти? 😊`;
  }

  return reply;
};
