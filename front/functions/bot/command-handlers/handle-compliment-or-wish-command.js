const axios = require('axios');
const { DB_BASE_URL } = process.env;

async function getRandomMessage(type, status) {
  const { data } = await axios.get(`${DB_BASE_URL}/messages/${type}/${status}`);

  if (!data.length) {
    const variants = { compliment: 'компліментиків', wish: 'побажаннячок' };

    return { text: `Нажаль поки що я не маю ${variants[type]}, вибач 😥` };
  }

  const randomIndex = Math.floor(Math.random() * data.length);

  const chosenMessage = data[randomIndex];
  const { _id, sendings } = chosenMessage;

  await axios.patch(`${DB_BASE_URL}/messages/${_id}`, { sendings: sendings + 1 });

  return chosenMessage;
}

module.exports = async function handleComplimentOrWishCommand(type, status) {
  let reply = '';

  if (type === 'compliment' && status !== 'sweet') {
    reply = 'Вибач, але компліменти я роблю лише Олені Рак. Для усіх інших я відправляю побажання.';
  } else {
    const { text } = await getRandomMessage(type, status);

    reply = text;
  }

  return reply;
};
