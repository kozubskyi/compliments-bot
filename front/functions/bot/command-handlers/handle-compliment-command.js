const axios = require('axios');
const { DB_BASE_URL } = process.env;

async function getRandomCompliment() {
  const { data } = await axios.get(`${DB_BASE_URL}/compliments`);

  if (!data.length) {
    return { text: `Нажаль поки що я не маю компліментиків, вибач 😥` };
  }

  const randomIndex = Math.floor(Math.random() * data.length);

  const chosenCompliment = data[randomIndex];
  const { _id, sendings } = chosenCompliment;

  await axios.patch(`${DB_BASE_URL}/compliments/${_id}`, {
    sendings: sendings + 1,
    lastSending: Date.now(),
  });

  return chosenCompliment;
}

module.exports = async function handleComplimentCommand(status) {
  let reply = '';

  if (status === 'sweet') {
    const { text } = await getRandomCompliment();

    reply = text;
  } else {
    reply = 'Вибач, але компліментики я роблю лише Олені Рак 🤷‍♂️'
  }

  return reply;
};
