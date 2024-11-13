const { isItKozubskyi } = require('../helpers/helpers')

module.exports = async function handleError({ ctx, err }) {
	if (!isItKozubskyi(ctx)) {
		await ctx.reply('Я трошки зламався, скоро полагоджусь і повернусь 👨‍🔧⚙️😊')
	}

	const { first_name, last_name, username, id } = ctx.from

	const chatId = Number(process.env.KOZUBSKYI_CHAT_ID)
	const infoReply = `❌ Помилка! Користувач ${first_name} ${last_name}${
		username ? ` (@${username})` : ''
	} ${id} відправив(-ла) повідомлення ${ctx.message.text} і виникла помилка:\n\n${err?.response?.data?.message ?? err}`

	await ctx.telegram.sendMessage(chatId, infoReply)
}
