const { Telegraf, Markup } = require('telegraf');
const dotenv = require('dotenv');
const makeResponse = require('./make-response');
const handleUser = require('./helpers/handle-user');
const commandsHtml = require('./helpers/commands');

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

function start() {
  // bot.start((ctx) => ctx.reply('Welcome')) //* Обробник команди '/start'
  // bot.help((ctx) => ctx.reply('Send me a sticker')) //* Обробник команди '/help'
  bot.on('sticker', ctx => ctx.reply('👍')); //* Обробник отримання стікера
  // bot.hears('hi', (ctx) => ctx.reply('Hey there')) //* Обробник тексту 'hi'
  // bot.command('oldschool', ctx => ctx.reply('Hello')) //* Обробник команди '/oldschool'
  // bot.command('hipster', Telegraf.reply('λ')) //* Обробник команди '/hipster'
  // bot.on('message', async ctx => await ctx.reply('message')); //* Обробник отримання повідомлення (ідентичний до 'text')
  // bot.action('btn_action', (ctx) => {}) //* Обробник начебто кнопок

  bot.on('text', async ctx => {
    await makeResponse(ctx, {
      firstName: ctx.message.from.first_name,
      lastName: ctx.message.from.last_name,
      username: ctx.message.from.username,
      chatId: ctx.message.chat.id,
      value: ctx.message.text,
    });
  });

  console.log('✅ The bot is configured and working correctly');
}

start();

// bot.launch();

// Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async event => {
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: '' };
  } catch (e) {
    console.error('error in handler:', e);
    return { statusCode: 400, body: 'This endpoint is meant for bot and telegram communication' };
  }
};
