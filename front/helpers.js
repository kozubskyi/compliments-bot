const axios = require('axios');
const { DB_BASE_URL } = process.env;

function getStartCmdResponse(status) {
  let response = null;

  if (status === 'sweet') {
    response =
      'Лєнусік, привіт) 😘 Денис просив передати тобі багато компліментиків. Напиши або натисни /compliment і отримаєшь компліментик)';
  } else if (status === 'creator') {
    response =
      'Денис, привіт 😊 працюю коректно, можеш це перевірити відправивши повідомлення з текстом /compliment';
  } else {
    response =
      'Привіт 😊 для отримання компліменту або побажання відправте повідомлення з текстом /compliment';
  }

  return response;
}

async function getRandomCompliment(status) {
  let response = null;

  if (status) {
    response = await axios.get(`${DB_BASE_URL}/compliments/${status}`);
  } else {
    response = await axios.get(`${DB_BASE_URL}/compliments`);
  }
  const randomIndex = Math.floor(Math.random() * response.data.length);

  const chosenCompliment = response.data[randomIndex];
  const { _id, sentTimes } = chosenCompliment;

  await axios.patch(`${DB_BASE_URL}/compliments/${_id}`, { sentTimes: sentTimes + 1 });

  return chosenCompliment;
}

async function getComplimentCmdResponse(status) {
  let chosenCompliment = null;

  if (status === 'sweet' || status === 'creator') {
    chosenCompliment = await getRandomCompliment(status);
  } else {
    chosenCompliment = await getRandomCompliment('others');
  }

  return chosenCompliment.text;
}

function getElseResponse(status) {
  let response = null;

  if (status === 'sweet') response = 'Я передам Денису те, що ти написала) 😘';
  else if (status === 'creator') response = '⚠️ Некоректна команда';
  else response = 'Я передам Денису те, що Ви написали 😉';

  return response;
}

function separateCommand(msg) {
  const msgArr = msg.split(' ');
  const cmd = msgArr[0];
  const text = msgArr.slice(1).join(' ');

  return [cmd, text];
}

module.exports = {
  getStartCmdResponse,
  getComplimentCmdResponse,
  getElseResponse,
  separateCommand,
};
